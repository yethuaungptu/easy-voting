require("dotenv").config();
const nodemailer = require("nodemailer");
const User = require("../model/user");
const Campaign = require("../model/campaign");
const CampaignData = require("../model/campaignData");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const CronJob = require("cron").CronJob;
const { insertMany } = require("../model/user");

exports.index = (req, res) => {
  Campaign.find({ select: "1" })
    .sort({ create: 1 })
    .exec((err, rtn) => {
      if (err) throw err;
      Campaign.find({ select: "2" })
        .sort({ create: 1 })
        .exec((err1, rtn1) => {
          if (err1) throw err1;
          Campaign.find({ select: "3" })
            .sort({ create: 1 })
            .exec((err2, rtn2) => {
              if (err2) throw err2;
              res.render("index", { king: rtn, project: rtn1, other: rtn2 });
            });
        });
    });
};

exports.login = async (req, res) => {
  res.render("login");
};

exports.loadLogin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, rtn) => {
    if (err) throw err;
    if (rtn == null) {
      res.render("login", { message: "Create your account" });
    } else {
      if (rtn.disable == false) {
        res.render("login", {
          message: "Your account has been disabled by admin",
        });
      } else {
        if (rtn.verify != true) {
          res.render("login", {
            verifyEmail: "Your email is not yet verified, so please confirm",
          });
        } else {
          if (
            rtn != null &&
            User.compare(req.body.password, rtn.password) &&
            rtn.verify == true
          ) {
            req.session.user = {
              id: rtn._id,
              name: rtn.name,
              email: rtn.email,
              votegive: rtn.votegive,
              password: rtn.password,
            };
            res.redirect("/");
          } else {
            res.render("login", { message: "something wrong!" });
          }
        }
      }
    }
  });
};

// for normal send verify mail
const sendVerifyMail = async (name, email, User_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: "Easy Vote<process.env.USER_EMAIL>",
      to: email,
      subject: "For Email Verification",
      html:
        "<p>Hi " +
        name +
        '<br/>Click confirm to <buttom><a href="http://127.0.0.1:3000/verify-login?id=' +
        User_id +
        '">verify</a></buttom> your account</p>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.signUp = (req, res) => {
  res.render("sign-up");
};
exports.loadSignUp = async (req, res) => {
  function register() {
    const { name, email, password } = req.body;
    let user = new User({
      name,
      email,
      password,
      verify: false,
      disable: true,
      date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
    var newUser = user.save();
    if (newUser) {
      sendVerifyMail(req.body.name, req.body.email, user._id);
      res.render("sign-up", {
        done: "You have successfully singup",
        ckeck: "Check your email to confirm",
      });
    }
  }

  let checkEmail = req.body.email;
  if (checkEmail.endsWith("@gmail.com")) {
    User.findOne({ email: req.body.email }, (err, rtn) => {
      if (err) throw err;
      if (rtn == null) {
        register();
      } else {
        if (rtn != null && rtn.email == req.body.email && rtn.verify == false) {
          User.deleteOne({ email: req.body.email }, (err2) => {
            if (err2) throw err2;
          });
          register();
        } else {
          if (rtn != null && rtn.verify == true) {
            res.render("sign-up", {
              message: "Email is exit! Try another email.",
            });
          }
        }
      }
    });
  } else {
    res.render("sign-up", { message: "Sign Up With @edu.mm" });
  }
};

//forget password

const sendforgetPassword = async (name, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
    const mailOptions = {
      from: "Easy Vote<process.env.USER_EMAIL>",
      to: email,
      subject: "Forget password",
      html:
        "<p>Hi " +
        name +
        ',Click reset password to <a href="http://127.0.0.1:3000/reset-password?token=' +
        id +
        '">create a new password</a>ကိုနှိပ်ပါ။</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.forgetPassword = (req, res) => {
  res.render("forget-password");
};

exports.loadForgetPassword = (req, res) => {
  User.findOne({ email: req.body.email }, (err, rtn) => {
    if (rtn == null) {
      res.render("forget-password", { message: "Your mail not found" });
    } else {
      if (rtn != null && rtn.verify == false) {
        res.render("forget-password", { message: "Use a verified mail" });
      }
      sendforgetPassword(rtn.name, rtn.email, rtn.id);
      res.render("forget-password", { msg: "Check your mail" });
    }
  });
};

exports.resetPassword = (req, res) => {
  User.findById(req.query.token, (err, rtn) => {
    if (err) throw err;
    res.render("reset-password", { id: rtn.id });
  });
};

exports.loadResetPassword = (req, res) => {
  User.findOne({ id: req.body.id }, (err, rtn) => {
    let resetpass = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(8),
      null
    );
    User.updateOne(
      { id: req.body.id },
      { $set: { password: resetpass } },
      (err1) => {
        if (err1) throw err1;
      }
    );
    res.redirect("/login");
  });
};

exports.changePassword = (req, res) => {
  res.render("change-password", {
    id: req.params.id,
  });
};

exports.loadChangePassword = (req, res) => {
  let newpass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
  User.findOne({ id: req.params.id }, (err, rtn) => {
    if (err) throw err;
    if (User.compare(req.body.password1, rtn.password)) {
      User.updateOne(
        { email: rtn.email },
        { $set: { password: newpass } },
        (err1) => {
          if (err1) throw err1;
          req.session.destroy((err2) => {
            if (err2) throw err2;
            res.redirect("/login");
          });
        }
      );
    } else {
      res.redirect("/change-password/" + req.params.id);
    }
  });
};

exports.verifyLogin = async (req, res) => {
  await User.updateOne({ _id: req.query.id }, { $set: { verify: true } });
  res.render("verify-login", {
    verify: "Your account has been verified",
  });
};

exports.loadVerifyLogin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, rtn) => {
    if (
      rtn != null &&
      User.compare(req.body.password, rtn.password) &&
      rtn.verify == true
    ) {
      req.session.user = {
        id: rtn._id,
        name: rtn.name,
        email: rtn.email,
        votegive: rtn.votegive,
        password: rtn.password,
      };
      res.redirect("/");
    } else {
      res.render("verify-login", { message: "something wrong!" });
    }
  });
};

exports.userLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};

exports.campaignList = (req, res) => {
  Campaign.find({ select: "1" }, (err, rtn) => {
    if (err) throw err;
    Campaign.find({ select: "2" }, (err2, rtn2) => {
      if (err2) throw err2;
      Campaign.find({ select: "3" }, (err3, rtn3) => {
        if (err3) throw err3;
        res.render("campaign-list", { king: rtn, project: rtn2, other: rtn3 });
      });
    });
  });
};

exports.voteResult = (req, res) => {
  Campaign.find({ select: "1" }, (err, rtn) => {
    if (err) throw err;
    Campaign.find({ select: "2" }, (err2, rtn2) => {
      if (err2) throw err2;
      Campaign.find({ select: "3" }, (err3, rtn3) => {
        if (err3) throw err3;
        res.render("vote-result", { king: rtn, project: rtn2, other: rtn3 });
      });
    });
  });
};

exports.campaignDetail = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    CampaignData.find({ campaignId: req.params.id }, (err2, rtn2) => {
      if (err2) throw err2;
      res.render("campaign-detail", { campaign: rtn, campaignData: rtn2 });
    });
  });
};

exports.voteGive = (req, res) => {
  if (req.body.type === "vote") {
    CampaignData.findById(req.body.camp, (err1, rtn1) => {
      let voteLength = rtn1.count + 1;
      CampaignData.findByIdAndUpdate(
        rtn1.id,
        { $set: { count: voteLength } },
        (err3) => {
          if (err3) throw err3;
        }
      );
    });
    Campaign.findByIdAndUpdate(
      req.body.id,
      { $push: { vote: { user: req.session.user.id } } },
      (err, rtn) => {
        if (err) {
          res.json({
            status: "error",
          });
        } else {
          res.json({
            status: true,
          });
        }
      }
    );
  } else {
    CampaignData.findById(req.body.camp, (err1, rtn1) => {
      let voteLength = rtn1.count - 1;
      CampaignData.findByIdAndUpdate(
        rtn1.id,
        { $set: { count: voteLength } },
        (err3) => {
          if (err3) throw err3;
        }
      );
    });
    Campaign.findById(req.body.id, (err, rtn) => {
      if (err) {
        res.json({
          status: "error",
        });
      } else {
        let voteList = rtn.vote.filter((data) => {
          return data.user != req.session.user.id;
        });
        Campaign.findByIdAndUpdate(
          req.body.id,
          { $set: { vote: voteList } },
          (err2, rtn2) => {
            if (err2) {
              res.json({
                status: false,
              });
            } else {
              res.json({
                status: true,
              });
            }
          }
        );
      }
    });
  }
};

exports.finalCamp = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $set: { votegive: true } },
    (err, rtn) => {
      if (err) throw err;
      // Campaign.findOne({ vote: req.params.id }, (err1, rtn1) => {
      //   if (err1) throw err1;
      //   console.log("shwo me", rtn1);
      // });
      res.redirect("/campaign-list");
    }
  );
};

exports.resultDetail = (req, res) => {
  res.render("result-detail");
};
