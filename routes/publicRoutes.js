const express = require("express");
const route = express.Router();
const { Admin } = require("../models/Admin");
const { AccessToken } = require("../models/AccessToken");

/**
 * Register for admin registration.
 * @param {JSON} params mail, password, name.
 * @returns {JSON} {adminObj} and token.
 */
route.post("/adminRegister", async (req, res) => {
  try {
    var enpw = await AccessToken.encryptPassword(req.body.password);
    var admin = new Admin({
      mail: req.body.mail,
      password: enpw,
      name: req.body.name
    });
    var adminObj = await admin.save();
    var token = await AccessToken.generateAuthToken(adminObj._id);
    await AccessToken.registerToken(adminObj._id, token, req.body.mail, 1);
    res.header("x-auth", token).send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Login for admin.
 * @param {JSON} params mail, password.
 * @returns token.
 */
route.post("/adminLogin", async (req, res) => {
  try {
    var admin = await Admin.findByCredentials(req.body.mail, req.body.password);
    if (admin) {
      var token = await AccessToken.generateAuthToken(admin._id);
      await AccessToken.updateToken(admin._id, token);
      res.header("x-auth", token).send(token);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    
    res.status(400).send(err);
  }
});

module.exports = route;
