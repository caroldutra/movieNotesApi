const { Router } = require("express");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const userRouter = require("./users.routes");
const routes = Router();

routes.use("/users", userRouter);
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;
