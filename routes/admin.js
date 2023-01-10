var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");

router.get("/", adminController.dashboard);

router.get("/login", adminController.login);

router.post("/login", adminController.loadLogin);

router.get("/campaign-list", adminController.campaignList);

router.get("/campaign-detail", adminController.campaignDetail);

module.exports = router;
