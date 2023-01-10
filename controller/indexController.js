exports.index = (req, res) => {
  res.render("index");
};

exports.voteGive = (req, res) => {
  res.render("vote-give");
};

exports.login = (req, res) => {
  res.render("login");
};

exports.signUp = (req, res) => {
  res.render("sign-up");
};

exports.forgetPassword = (req, res) => {
  res.render("forget-password");
};
