const express = require("express");
const router = express.Router();

const indexController = require("../controller/indexController");

router.get("/", indexController.index);

router.get("/vote-give", indexController.voteGive);

router.get("/login", indexController.login);

router.get("/forget-password", indexController.forgetPassword);

router.get("/sign-up", indexController.signUp);

module.exports = router;
