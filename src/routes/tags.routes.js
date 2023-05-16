const { Router } = require("express");
const TagsController = require("../controllers/TagsController");
const tagsRouter = Router();
const tagsController = new TagsController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

tagsRouter.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRouter;
