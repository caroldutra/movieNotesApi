const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    if (rating > 5 || rating < 1) {
      throw new AppError(
        "O rating varia de 1 a 5, digite um número que esteja dentro desse intervalo"
      );
    }

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        user_id,
        name,
        note_id,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ note_id: id });

    return response.json({ ...note, tags });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, rating, tags } = request.query;
    const user_id = request.user.id;

    let note;

    if (tags && rating) {
      const filteredTags = tags.split(",").map((tag) => tag.trim());

      note = await knex("movie_tags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.user_id",
          "movie_notes.rating",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .andWhereLike("movie_notes.rating", `${rating}`)
        .whereIn("name", filteredTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id");
    }

    if (rating && !tags) {
      note = await knex("movie_notes")
        .where({ rating })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    if (tags && !rating) {
      const filteredTags = tags.split(",").map((tag) => tag.trim());
      note = await knex("movie_tags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.user_id",
          "movie_notes.rating",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filteredTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id");
    }

    if (!tags && !rating) {
      note = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = note.map((note) => {
      const notesTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: notesTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;
