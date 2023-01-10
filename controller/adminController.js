require("dotenv").config();

exports.dashboard = (req, res) => {
  res.render("admin/dashboard");
};

exports.login = (req, res) => {
  res.render("admin/login");
};

exports.loadLogin = (req, res) => {
  if (
    req.body.email == process.env.adminMail &&
    req.body.password == process.env.adminPassword
  ) {
    res.redirect("/admin");
  } else {
    res.redirect("/admin/admin-login");
  }
};

exports.campaignList = (req, res) => {
  res.render("admin/campaign-list");
};

exports.campaignDetail = (req, res) => {
  res.render("admin/campaign-detail");
};
