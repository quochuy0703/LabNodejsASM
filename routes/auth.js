const express = require("express");
const Router = express.Router();

const authController = require("../controllers/auth");

Router.get("/login", authController.getLogin);
Router.post("/login", authController.postLogin);

module.exports = Router;