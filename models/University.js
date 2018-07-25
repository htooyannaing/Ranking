const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UniversitySchema = new Schema({
  uniname: String,
  uni_short_name: String,
  uni_mail: String,
  ph_no: String,
  address: String,
  academic_started_year: String,
  academic_ended_year: String,
  status_flag: 0,
  wrong_infos: [],
  majors: [
    {
      major_name: String,
      major_short_name: String
    }
  ],
  degree: [
    {
      degree_name: String,
      degree_short_name: String
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
 * Register university's information.
 * @param {JSON} universityObj
 * @returns {JSON} universityObj
 */
UniversitySchema.statics.registerUniversity = async function(universityObj) {
  if (universityObj.majors == null) {
    universityObj.majors = [];
  }
  if (universityObj.degrees == null) {
    universityObj.degrees = [];
  }
  var university = new University({
    uniname: universityObj.uniname,
    uni_short_name: universityObj.uni_short_name,
    uni_mail: universityObj.uni_mail,
    ph_no: universityObj.ph_no,
    address: universityObj.address,
    academic_started_year: universityObj.academic_started_year,
    academic_ended_year: universityObj.academic_ended_year,
    majors: universityObj.majors,
    degree: universityObj.degrees,
    created_by: universityObj.admin_id
  });
  await university.save();
  return university;
};


/**Update the university's information by admin.
 * @param {JSON} params universityObject
 * @return {JSON} universityobj
 */
UniversitySchema.statics.updateUniversity = async function(universityObj) {
  if (universityObj.majors == null) {
    universityObj.majors = [];
  }
  if (universityObj.degrees == null) {
    universityObj.degrees = [];
  }
  var updateUni = await University.findByIdAndUpdate(
    { _id: universityObj.id },
    {
      $set: {
        uniname: universityObj.uniname,
        uni_short_name: universityObj.uni_short_name,
        uni_mail: universityObj.uni_mail,
        ph_no: universityObj.ph_no,
        address: universityObj.address,
        academic_started_year: universityObj.academic_started_year,
        academic_ended_year: universityObj.academic_ended_year,
        majors: universityObj.majors,
        degrees: universityObj.degrees,
        updated_date: new Date(),
        updated_by: universityObj.admin_id
      }
    },
    { upsert: true }
  );
  return updateUni;
};


var University = mongoose.model("University", UniversitySchema);

module.exports = { University };
