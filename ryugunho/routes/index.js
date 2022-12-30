const express = require("express");

const routes = express.Router();

const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const likeRoutes = require("./likeRoutes");

routes.use("/user", userRoutes);
routes.use("/post", postRoutes);
routes.use("/like", likeRoutes);

module.exports = routes