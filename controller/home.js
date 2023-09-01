const path = require("path");

const home = (req, res) => {
  return res.send("Welcome to AWT system");
};

module.exports = {
  getHome: home
};