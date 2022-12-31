const postController = require("../controller/postController");
const verifyToken = require("../middlewares/verifyToken");

const express = require("express");

const routes = express.Router();

routes.get("/user", verifyToken, postController.displayAllPosts);
routes.post("", verifyToken, postController.createPost)
routes.patch("/:postId/user", postController.updatePost);
routes.delete("/:postId", postController.deletePost);


module.exports = routes;