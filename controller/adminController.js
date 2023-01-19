require("dotenv").config();
const Admin = require("../model/admin");
const Campaign = require("../model/campaign");

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

exports.loadCampaignList = (req, res) => {
  const { title, description, select, image } = req.body;
  var campaign = new Campaign({
    title,
    description,
    select,
    image,
  });
  var newCampaign = campaign.save();
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
  res.redirect("/admin/campaign-list");
};

exports.campaignDetail = (req, res) => {
  res.render("admin/campaign-detail");
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/login");
  });
};

exports.other = (req, res) => {
  res.render("admin/other");
};

exports.project = (req, res) => {
  res.render("admin/project");
};

exports.kingQueen = (req, res) => {
  res.render("admin/king-queen");
};
