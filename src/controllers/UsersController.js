const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();
    const hashedPassword = await hash(password, 8);
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Email já cadastrado!");
    }

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Esse email já está cadastrado por outro usuário");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Digite a sua senha antiga!");
    }

    if (password && old_password) {
      const passwordOk = await compare(old_password, user.password);

      if (!passwordOk) {
        throw new AppError("A senha antiga não confere!");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `UPDATE users SET 
      name = ?, 
      email = ?,
      password = ?, 
      updated_at = DATETIME('now') 
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    response.json();
  }
}

module.exports = UserController;
