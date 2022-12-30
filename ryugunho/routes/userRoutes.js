const express = require("express");

const userController = require("../controller/userController");

const routes = express.Router();

routes.post("", userController.signUp);
routes.post("/login", userController.signIn);

module.exports = routes;