const userControl = require("../controller/userController");

const express = require("express");
const routes = express.Router();

const userController = new userControl();

routes.post("/user", userController.signUp);

routes.post("/login", userController.signIn);

routes.get("/user/post/:userId", userController.displayAllPosts);

module.exports = routes;