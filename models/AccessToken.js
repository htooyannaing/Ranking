const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var accessTokenSchema = new Schema({
  //0: User, 1: Admin
  user_type: Number,
  user_id: mongoose.Schema.Types.ObjectId,
  mail: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ],
  created_by: mongoose.Schema.Types.ObjectId,
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: Date,
  updated_by: mongoose.Schema.Types.ObjectId
});

/**
 * Generate token for authentication.
 * @param {mongoose.Schema.Types.ObjectId} userId
 * @returns token.
 */
accessTokenSchema.statics.generateAuthToken = async function(userId) {
  try {
    var access = "auth";
    var token = jwt
      .sign({ _id: userId.toHexString(), access }, "abcd1234")
      .toString();
    return token;
  } catch (error) {
    return error;
  }
};

/**
 *Create new accessToken object and then save token when user or admin is registered.
 * @param {mongoose.Schema.Types.ObjectId} userId
 * @param {String} token
 * @param {String} mail
 * @returns {Object} accessToken.
 */
accessTokenSchema.statics.registerToken = async function(
  userId,
  token,
  mail,
  userType
) {
  var access = "auth";
  var accToken = new AccessToken({
    mail: mail,
    user_id: userId,
    user_type: userType,
    tokens: {
      access,
      token
    },
    token_type: 0,
    created_by: userId
  });
  await accToken.save();
  return accToken;
};

/**
 *Update token when user or admin is logged in.
 * @param {mongoose.Schema.Types.ObjectId} userId
 * @param {String} token
 * @returns {Object} accessToken.
 */
accessTokenSchema.statics.updateToken = async function(userId, token) {
  var access = "auth";
  try {
    var accToken = await AccessToken.findOneAndUpdate(
      { user_id: userId },
      {
        $push: {
          tokens: {
            access,
            token
          }
        },
        $set: {
          updated_by: userId,
          updated_date: new Date()
        }
      }
    );
    return accToken;
  } catch (error) {
    return error;
  }
};

/**
 * Entering password is encrypted.
 * @param {String} password
 * @returns {String} encrypted password.
 */
accessTokenSchema.statics.encryptPassword = async function(password) {
  try {
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    res.status(400).send(error);
  }
};

/**
 * When user logged out, token is removed.
 * @param {String} token
 */
accessTokenSchema.statics.removeToken = function(token) {
  var accToken = this;
  return accToken.update({
    $pull: {
      tokens: { token }
    }
  });
};

accessTokenSchema.statics.findByToken = async function(token) {
  var AccessToken = this;
  try {
    var decoded = jwt.verify(token, "abcd1234");
    var admin = await AccessToken.findOne({
      user_id: decoded._id,
      "tokens.token": token,
      "tokens.access": "auth"
    });

    if (!admin) {
      throw new Error("Invalid token!");
    }

    return admin;
  } catch (err) {
    return Promise.reject(err);
  }
};

var AccessToken = mongoose.model("AccessToken", accessTokenSchema);

module.exports = { AccessToken };
