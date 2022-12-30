const likeController = require("../controller/likeController");
const verifyToken = require("../middlewares/verifyToken");

const express = require("express");
const routes = express.Router();

routes.post("/user", verifyToken, likeController.createLike);


module.exports = routes;