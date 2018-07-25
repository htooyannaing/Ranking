const express = require("express");
const router = express.Router();
const { University } = require("../models/University");
const { User } = require("../models/User");
const { FormDefination } = require("../models/FormDefination");

/**post update University
 * @param {JSON} params universityObject
 * @return universityobj
 */
router.post("/updateUniversity", async (req, res) => {
  try {
    if (req.body._id) {
      var university = await University.updateUniversity(req.body);
    } else {
      var university = await University.registerUniversity(req.body);
    }
    res.send(university);
  } catch (e) {
    res.status(400).send();
  }
});

/**Get university detail
 * @param university_id
 * @return universityobj
 */
router.get("/universityDetail/:university_id", async (req, res) => {
  try {
    var university_id = req.params.university_id;
    var university = await University.findById(university_id);
    res.send(university);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**Get user detail
 * @param userId
 * @return userobj
 */
router.get("/userDetail/:user_id", async (req, res) => {
  try {
    var user_id = req.params.user_id;
    var user = await User.findById(user_id);
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * Register or update the university's information.
 * @param {JSON} params universityObj.
 * @return {JSON} universityObj.
 */
router.post("/updateUniversity", async (req, res) => {
  if (req.body.id) {
    var university = await University.updateUniversity(req.body);
    res.send(university);
  } else {
    var university = await University.registerUniversity(req.body);
    res.send(university);
  }
  res.send(university);
});

/**
 * Get university's information.
 * @param {mongoose.Schema.Types.ObjectId} universiytId.
 * @returns {JSON} universityObj.
 */
router.get("/universityDetail/:university_id", async (req, res) => {
  try {
    var university_id = req.params.university_id;
    var university = await University.findById(university_id);
    res.send(university);
  } catch (e) {
    res.status(400).send;
  }
});

/**
 * Get all universities.
 * @return university lists.
 */
router.get("/universityList", async (req, res) => {
  var uniList = await University.find();
  var uniArr = [];
  for (let uniObj of uniList) {
    var result = {
      id: uniObj._id,
      uniname: uniObj.uniname,
      uni_short_name: uniObj.uni_short_name,
      uni_mail: uniObj.uni_mail,
      pgno: uniObj.pgno,
      ph_no: uniObj.ph_no,
      address: uniObj.address,
      academic_started_year: uniObj.academic_started_year,
      academic_ended_year: uniObj.academic_ended_year,
      majors: uniObj.majors,
      degree: uniObj.degree
    };
    uniArr.push(result);
  }
  res.send(uniArr);
});

/**
 * Delete university's information
 * @param {mongoose.Schema.Types.ObjectId} universityId
 */
router.post("/deleteUniversity", async (req, res) => {
  try {
    var uniId = req.body.id;
    var result = await University.findByIdAndRemove(uniId);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/search/:tbName/:name/:key", async (req, res) => {
  try {
    var colName = req.params.name;
    var searchKey = req.params.key;
    var table_name = req.params.tbName;
    if(table_name === "User") {
      var result = await User.setIndexAndFind(colName, searchKey);
      await User.deleteIndex(colName);
      res.send(result)
    } else {
      var data = await University.find({});
      res.send(data)
    }
  } catch (e) {}
});

router.post("/formDefinationDataList", async (req, res) => {
  var table_name = req.body.table_name;
  console.log(req.headers['x-auth']);
  
  var dataList = await FormDefination.getDataList(table_name);
  res.send(dataList);
});

/**Get user's detail.
 * @param {mongoose.Schema.Types.ObjectId} userId.
 * @return {JSON} userobj.
 */
router.get("/userDetail/:user_id", async (req, res) => {
  try {
    var user_id = req.params.user_id;
    var user = await User.findById(user_id);
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * Get limit university lists.
@param {JSON} params universityObj.
@returns university lists.
 */
router.post("/universityListLimit", async (req, res) => {
  try {
    var pgno = req.body.pgno;
    var limit = req.body.limit;
    var count = await University.count();
    var universityList = await University.find()
      .skip(pgno)
      .limit(limit);
    var uniArr = [];
    for (let uniObj of universityList) {
      var result = {
        id: uniObj._id,
        uniname: uniObj.uniname,
        uni_short_name: uniObj.uni_short_name,
        uni_mail: uniObj.uni_mail,
        ph_no: uniObj.ph_no,
        address: uniObj.address,
        academic_started_year: uniObj.academic_started_year,
        academic_ended_year: uniObj.academic_ended_year,
        majors: uniObj.majors,
        degrees: uniObj.degrees
      };
      uniArr.push(result);
    }
    res.send({ uniArr, count });
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * Get limit user lists
@param {JSON} params userObj
@returns user lists
 */
router.post("/userListLimit", async (req, res) => {
  try {
    var pgno = req.body.pgno;
    var limit = req.body.limit;
    var count = await User.count();
    var userList = await User.find()
      .skip(pgno)
      .limit(limit);
    var userArr = [];
    for (let userObj of userList) {
      var result = {
        id: userObj._id,
        mail: userObj.mail,
        personal: {
          id: userObj.personal._id,
          name: userObj.personal.name,
          nrc: userObj.personal.nrc,
          dob: userObj.personal.dob,
          profile_image: userObj.personal.profile_image
        },
        academic_histories: {
          student_id: userObj.academic_histories.student_id,
          idCard_img: userObj.academic_histories.idCard_img,
          role_no: userObj.academic_histories.role_no,
          university_id: userObj.academic_histories.university_id,
          major_id: userObj.academic_histories.major_id,
          attended_year: userObj.academic_histories.attended_year,
          degree_id: userObj.academic_histories.degree_id,
          academic_started_year:
            userObj.academic_histories.academic_started_year,
          academic_ended_year: userObj.academic_histories.academic_ended_year,
          related_technical_infos:
            userObj.academic_histories.related_technical_infos,
          project_descriptions: userObj.academic_histories.project_descriptions
        }
      };
      userArr.push(result);
    }
    res.send({ userArr, count });
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * Get all user lists
@param {JSON} params userObj
@returns user lists
 */
router.get("/userList", async (req, res) => {
  try {
    var userList = await User.find();
    var userArr = [];
    for (let userObj of userList) {
      var result = {
        id: userObj._id,
        mail: userObj.mail,
        personal: {
          id: userObj.personal._id,
          name: userObj.personal.name,
          nrc: userObj.personal.nrc,
          ph_no: userObj.personal.ph_no,
          dob: userObj.personal.dob,
          status_flag: userObj.personal.status_flag,
          profile_img: userObj.personal.profile_img
        },
        academic_histories: {
          student_id: userObj.academic_histories.student_id,
          idCard_img: userObj.academic_histories.idCard_img,
          role_no: userObj.academic_histories.role_no,
          university_id: userObj.academic_histories.university_id,
          major_id: userObj.academic_histories.major_id,
          attended_year: userObj.academic_histories.attended_year,
          degree_id: userObj.academic_histories.degree_id,
          academic_started_year:
            userObj.academic_histories.academic_started_year,
          academic_ended_year: userObj.academic_histories.academic_ended_year,
          related_technical_infos:
            userObj.academic_histories.related_technical_infos,
          project_descriptions: userObj.academic_histories.project_descriptions,
          wrong_infos: userObj.academic_histories.wrong_infos
        }
      };
      userArr.push(result);
    }
    res.send(userArr);
  } catch (e) {
    res.status(400).send();
  }
});

/**Register FormDefination data.
 * @param {JSON} params FormDefinationObject.
 * @return FormDefinationObject.
 */
router.post("/insertFormDefinationData", async (req, res) => {
  try {
    var data = req.body;
    result = await FormDefination.registerData(data);
    res.send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**Get formDefinationDataList.
 *@param {JSON} params table_name
 *@returns formDefinationDataList
 */
router.post("/formDefinationDataList", async (req, res) => {
  var table_name = req.body.table_name;
  var dataList = await FormDefination.getDataList(table_name);
  res.send(dataList);
});

/**
 * Register permation datas.
 * @param {JSON} params permationDataObj.
 * @returns {JSON} permationDataObj
 */
router.post("/registerPermationData", async (req, res) => {
  var permation_data = req.body;
  var permation_data = new PermationData({
    permation_data: req.body.permation_data
  });
  permation_data.save();
  return permation_data;
});

/**
 * Deleting Image From Resource
 * @param _id (Resource ID)
 * @returns {String}
 */
router.post("/deleteProfileImg", async (req, res) => {
  try {
    var id = req.body._id;
    console.log(id);

    await Resource.findByIdAndRemove({ _id: id });

    res.send("Delete Done");
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

/**
 * Updating User information is fake or real or need
 * @param userId
 * @param status_flag
 * @returns {JSON} updatedResult
 */
router.post("/updatePersonalStatusFlag", async (req, res) => {
  try {
    var updatedResult = await User.updatePersonalStatusFlag(
      req.body.userId,
      req.body.status_flag
    );
    res.send(updatedResult);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
});

/**
 * Updating Univeristy Information is fake or real or need
 * @param uniId
 * @param status_flag
 * @returns {JSON} updatedResult
 */
router.post("/updateUniStatusFlag", async (req, res) => {
  try {
    var updatedResult = await University.updateUniStatusFlag(
      req.body.uniId,
      req.body.status_flag
    );
    res.send(updatedResult);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
});

/**
 * When user click fake or need the checked value will store in user table
 * @param {String} userId
 * @param {Array} wrongInfo
 * @returns {JSON} updatedResult
 */
router.post("/updateWrongUserInfo", async (req, res) => {
  try {
    var updatedResult = await User.updateWrongUserInfo(
      req.body.userId,
      req.body.wrongInfo
    );
    res.send(updatedResult);
  } catch (e) {
    res.send(e.message);
  }
});

/**
 * When user click fake or need the checked value will store in Univeristy table
 * @param {String} uniId
 * @param {Array} wrongInfo
 * @returns {JSON} updatedResult
 */
router.post("/updateWrongUniInfo", async (req, res) => {
  try {
    var updatedResult = await University.updateWrongUniInfo(
      req.body.uniId,
      req.body.wrongInfo
    );
    res.send(updatedResult);
  } catch (e) {
    res.send(e.message);
  }
});

/**
 * Getting Fank and Need Information from user table wrong_infos field
 * @param {String} userId
 * @returns {Array} wrongInfo
 */
router.post("/getWrongUser", async (req, res) => {
  try {
    var wrongInfo = await User.getWrongInfo(req.body.userId);
    res.send(wrongInfo);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
