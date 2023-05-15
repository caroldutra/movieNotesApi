const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const notesRouter = Router();
const notesController = new NotesController();

notesRouter.use(ensureAuthenticated);

notesRouter.get("/", notesController.index);
notesRouter.post("/", notesController.create);
notesRouter.get("/:id", notesController.show);
notesRouter.delete("/:id", notesController.delete);

module.exports = notesRouter;
