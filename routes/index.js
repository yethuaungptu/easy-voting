const express = require("express");
const router = express.Router();

const indexController = require("../controller/indexController");

router.get("/", indexController.index);

router.get("/vote-give", indexController.voteGive);

router.get("/login", indexController.login);

router.post("/login", indexController.loadLogin);

router.get("/forget-password", indexController.forgetPassword);

router.get("/sign-up", indexController.signUp);

router.post("/sign-up", indexController.loadSignUp);

router.get("/verify-login", indexController.verifyLogin);

router.post("/verify-login", indexController.loadVerifyLogin);

module.exports = router; 