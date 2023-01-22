require("dotenv").config();
const Admin = require("../model/admin");
const Campaign = require("../model/campaign");
const CampaignData = require("../model/campaignData");
const fs = require("fs");

exports.dashboard = (req, res) => {
  res.render("admin/dashboard");
};

exports.login = (req, res) => {
  Admin.findOne({ name: "Admin" }, (err, rtn) => {
    if (err) throw err;
    if (rtn == null) {
      const name = "Admin",
        email = "admin@gmail.com",
        password = "admin";
      var admin = new Admin({
        name,
        email,
        password,
      });
      admin.save();
    }
  });
  res.render("admin/login");
};

exports.loadLogin = (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, rtn) => {
    if (err) throw err;
    if (rtn != null && req.body.password == rtn.password) {
      req.session.admin = {
        id: rtn._id,
        name: rtn.name,
        email: rtn.email,
        password: rtn.password,
      };
      res.redirect("/admin");
    } else {
      res.redirect("/admin/login");
    }
  });
};

exports.changePassword = (req, res) => {
  res.render("admin/change-password");
};

exports.loadChangePassword = (req, res) => {
  Admin.findOneAndUpdate(
    { password: req.body.password1 },
    { $set: { password: req.body.password } },
    (err, rtn) => {
      if (err) throw err;
      if (rtn == null) {
        res.redirect("/admin/change-password");
      } else {
        req.session.destroy((err, rtn) => {
          if (err) throw err;
          res.redirect("/admin");
        });
      }
    }
  );
};

exports.campaignList = (req, res) => {
  res.render("admin/campaign-list");
};

exports.campaignDetail = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    CampaignData.find({ campaignId: rtn.id }, (err1, rtn1) => {
      if (err1) throw err1;
      res.render("admin/campaign-detail", { data: rtn, user: rtn1 });
    });
  });
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/login");
  });
};

exports.other = (req, res) => {
  Campaign.find({ select: "3" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/other", { data: rtn });
  });
};

exports.project = (req, res) => {
  Campaign.find({ select: "2" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/project", { data: rtn });
  });
};

exports.kingQueen = (req, res) => {
  Campaign.find({ select: "1" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/king-queen", { data: rtn });
  });
};

exports.create = (req, res) => {
  res.render("admin/create");
};

exports.loadCreate = (req, res) => {
  var campaign = new Campaign();
  campaign.title = req.body.title;
  campaign.description = req.body.description;
  campaign.select = req.body.select;
  if (req.file) campaign.image = "/images/upload/cover/" + req.file.filename;
  campaign.save();

  let opt = req.body.select;
  if (opt == "1") {
    res.redirect("/admin/king-queen");
  } else {
    if (opt == "2") {
      res.redirect("/admin/project");
    } else {
      if (opt == "3") {
        res.redirect("/admin/other");
      }
    }
  }
};

exports.campaignDelete = (req, res) => {
  CampaignData.find({ campaignId: req.params.id }, (err1, rtn1) => {
    if (err1) throw err1;
    for (var i = 0; i < rtn1.length; i++) {
      fs.unlink("public" + rtn1[i].image, (err2) => {
        if (err2) throw err2;
      });
    }
    CampaignData.deleteMany({ campaignId: req.params.id }, (err3) => {
      if (err3) throw err3;
    });
  });
  Campaign.findByIdAndDelete(req.params.id, (err, rtn) => {
    if (err) throw err;
    fs.unlink("public" + rtn.image, (err) => {
      if (err) throw err;
      if (rtn.select == "1") {
        res.redirect("/admin/king-queen");
      } else {
        if (rtn.select == "2") {
          res.redirect("/admin/project");
        } else {
          if (rtn.select == "3") {
            res.redirect("/admin/other");
          }
        }
      }
    });
  });
};

exports.campaignData = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    res.render("admin/campaign-data", { data: rtn });
  });
};

exports.loadCampaignData = (req, res) => {
  var campaignData = new CampaignData();
  campaignData.name = req.body.name;
  campaignData.campaignId = req.body.id;
  campaignData.description = req.body.desc;
  if (req.file) campaignData.image = "/images/upload/img/" + req.file.filename;
  campaignData.save();
  Campaign.findById(req.body.id, (err, rtn) => {
    if (rtn.id == req.body.id) {
      res.redirect("/admin/campaign-detail/" + req.body.id);
    }
  });
};

exports.userDelete = (req, res) => {
  CampaignData.findByIdAndDelete(req.params.id, (err, rtn) => {
    if (err) throw err;
    fs.unlink("public" + rtn.image, (err2) => {
      if (err2) throw err2;
      res.redirect("/admin/campaign-detail/" + rtn.campaignId);
    });
  });
};
