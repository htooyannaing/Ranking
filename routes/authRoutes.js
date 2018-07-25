const { User } = require("../models/User");
const { AccessToken } = require("../models/AccessToken");
const { Admin } = require("../models/Admin");
const { FormDefination } = require("../models/FormDefination");
const { University } = require("../models/University");
//const { PermationData } = require("../models/PermationData");

module.exports = app => {
  app.post("/updateUser", async (req, res) => {
    try {
      if (req.body.id) {
        var user = await User.updateUser(req.body);
        res.send(user);
      } else {
        var user = await User.registerUser(req.body);
        var token = await AccessToken.generateAuthToken(user._id);
        await AccessToken.registerToken(user._id, token, user.mail);
        res.header("x-auth", token).send(user);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post("/api/adminLogin", async (req, res) => {
    try {
      var admin = await Admin.findByCredentials(
        req.body.mail,
        req.body.password
      );
      if (admin) {
        var token = await AccessToken.generateAuthToken(admin._id, admin.mail);
        res.header("x-auth", token).send(token);
      } else {
        res.status(400).send();
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post("/deleteUser", async (req, res) => {
    try {
      if (req.body.id) {
        var user = await User.deleteUser(req.body.id);
        res.send();
      } else {
        res.status(400).send(err);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post("/adminRegister", async (req, res) => {
    try {
      var enpw = await AccessToken.encryptPassword(req.body.password);
      var admin = new Admin({
        mail: req.body.mail,
        password: enpw,
        name: req.body.name
      });
      var adminObj = await admin.save();
      var token = await AccessToken.generateAuthToken(adminObj._id);
      await AccessToken.registerToken(adminObj._id, token, req.body.mail);
      res.header("x-auth", token).send(admin);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post("/insertFormDefinationData", async (req, res) => {
    try {
      var data = req.body;
      result = await FormDefination.registerData(data);
      res.send(result);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.post("/adminLogout", async (req, res) => {
    try {
      var admin = await AccessToken.removeToken(req.token);
      res.status(200).send(admin);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.post("/updateUniversity", async (req, res) => {
    var university = await University.registerUniversity(req.body);
    res.send(university);
  });
};
const express = require("express");
const auth = express.Router();

/**
 *Register or update user's informations.
 *@param {JSON} params {userObj}.
 *@returns {JSON} {userObj}.
 *@returns {JSON} {userObj} and token.
 */
auth.post("/updateUser", async (req, res) => {
  try {
    if (req.body.id) {
      var user = await User.updateUser(req.body);
      res.send(user);
    } else {
      var user = await User.registerUser(req.body);
      var token = await AccessToken.generateAuthToken(user._id);
      await AccessToken.registerToken(user._id, token, user.mail, 0);
      res.header("x-auth", token).send(user);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 *Delete user's informations.
 *@param {JSON} params userId.
 *@returns "Deleted"
 */
auth.post("/deleteUser", async (req, res) => {
  try {
    if (req.body.id) {
      var user = await User.deleteUser(req.body.id);
      res.send("Deleted");
    } else {
      res.status(400).send(err);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * When user logged out, remove the token.
 * @param {String} params token
 * @returns {JSON} adminObj
 */
auth.post("/adminLogout", async (req, res) => {
  try {
    var admin = await AccessToken.removeToken(req.headers.token);
    res.status(200).send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = auth;
