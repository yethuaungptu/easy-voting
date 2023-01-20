var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");
const { adminAuth } = require("../middleware/admin-auth");
const multer = require("multer");
const upload = multer({ dest: "public/images/upload" });

router.get("/", upload.single("image"), adminAuth, adminController.dashboard);

router.get("/login", adminController.login);

router.post("/login", adminController.loadLogin);

router.get("/change-password", adminController.changePassword);

router.post("/change-password", adminController.loadChangePassword);

router.get("/logout", adminController.adminLogout);

router.get("/campaign-list", adminController.campaignList);

router.post("/campaign-list", adminController.loadCampaignList);

router.get("/campaign-detail", adminController.campaignDetail);

router.get("/other", adminController.other);

router.get("/project", adminController.project);

router.get("/king-queen", adminController.kingQueen);

module.exports = router;
