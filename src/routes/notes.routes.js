const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const notesRouter = Router();
const notesController = new NotesController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

notesRouter.use(ensureAuthenticated);

notesRouter.post("/", notesController.create);
notesRouter.get("/:id", notesController.show);
notesRouter.delete("/:id", notesController.delete);
notesRouter.get("/", notesController.index);

module.exports = notesRouter;
