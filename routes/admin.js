var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");
const { adminAuth } = require("../middleware/admin-auth");
const multer = require("multer");
const upload = multer({ dest: "public/images/upload/cover" });
const uploadData = multer({ dest: "public/images/upload/img" });

router.get("/", adminAuth, adminController.dashboard);

router.get("/login", adminController.login);

router.post("/login", adminController.loadLogin);

router.get("/change-password", adminController.changePassword);

router.post("/change-password", adminController.loadChangePassword);

router.get("/logout", adminController.adminLogout);

router.get("/campaign-list", adminController.campaignList);

router.get("/campaign-detail/:id", adminController.campaignDetail);

router.get("/other", adminController.other);

router.get("/project", adminController.project);

router.get("/king-queen", adminController.kingQueen);

router.get("/create", adminController.create);

router.post("/create", upload.single("image"), adminController.loadCreate);

router.get("/campaign-delete/:id", adminController.campaignDelete);

router.get("/campaign-data/:id", adminController.campaignData);

router.post(
  "/campaign-data/id",
  uploadData.single("image"),
  adminController.loadCampaignData
);

router.get("/user-delete/:id", adminController.userDelete);

module.exports = router;
