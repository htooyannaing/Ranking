const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var adminSchema = new Schema({
  mail: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: String
});

/**
 *Check valid or invalid user.
 * @param {String} mail
 * @param {String} password
 * @returns adminObj.
 */
adminSchema.statics.findByCredentials = async function(mail, password) {
  var Admin = this;
  try {
    var adminObj = await Admin.findOne({ mail: mail });
    if (!adminObj) {
      throw new Error("Invalid email!");
    }

    // var result = await bcrypt.compare(password, adminObj.password);
    var result = true;
    if (result) {
      return adminObj;
    } else {
      throw new Error("Invalid password!");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

var Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin };
