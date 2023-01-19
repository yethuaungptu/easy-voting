require("dotenv").config();
const nodemailer = require("nodemailer");
const User = require("../model/user");
const SMTPConnection = require("nodemailer/lib/smtp-connection");

exports.index = (req, res) => {
  res.render("index");
};

exports.voteGive = (req, res) => {
  res.render("vote-give");
};

exports.login = async (req, res) => {
  res.render("login");
};

exports.loadLogin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, rtn) => {
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
        res.redirect("/");
      } else {
        res.render("login", { message: "something wrong!" });
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
  let checkEmail = req.body.email;
  if (checkEmail.endsWith("@gmail.com")) {
    const { name, email, password } = req.body;
    let user = new User({
      name,
      email,
      password,
      verify: false,
    });
    var newUser = user.save();
    if (newUser) {
      sendVerifyMail(req.body.name, req.body.email, user._id);
      res.render("sign-up", {
        done: "You have successfully singup",
        ckeck: "Check your email to confirm",
      });
    }
  } else {
    res.render("sign-up", { message: "Sign Up With @edu.mm" });
  }
};

exports.forgetPassword = (req, res) => {
  res.render("forget-password");
};

exports.verifyLogin = async (req, res) => {
  await User.updateOne({ _id: req.query.id }, { $set: { verify: true } });
  res.render("verify-login", {
    verify: "Your account has been verified",
  });
};

exports.loadVerifyLogin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, rtn) => {
    console.log(rtn);
    if (
      rtn != null &&
      User.compare(req.body.password, rtn.password) &&
      rtn.verify == true
    ) {
      res.redirect("/");
    } else {
      res.render("verify-login", { message: "something wrong!" });
    }
  });
};
