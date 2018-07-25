const mongoose = require("mongoose");
const { AccessToken } = require("./AccessToken");
const { Image } = require("./Image");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  mail: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  personal: {
    name: String,
    nrc: String,
    ph_no: String,
    dob: Date,
    profile_img: String,
    status_flag: Number // This One Need to check Real User Or Fake OR Need Plz don't delete
  },
  academic_histories: {
    student_id: String,
    idCard_imgs: [
      {
        type: String
      }
    ],
    role_no: String,
    university_id: mongoose.Schema.Types.ObjectId,
    major_id: mongoose.Schema.Types.ObjectId,
    attended_year: String,
    degree_id: mongoose.Schema.Types.ObjectId,
    academic_started_year: String,
    academic_ended_year: String,
    related_technical_infos: String,
    project_descriptions: String,
    status_flag: Number,
    wrong_infos: []
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: Date,
  updated_by: mongoose.Schema.Types.ObjectId
});

/**Register user's information.
 * @param {JSON} params userObject
 * @return {JSON} userObject
 */
userSchema.statics.registerUser = async function(userObj) {
  var enpw = await AccessToken.encryptPassword(userObj.password);
  var user = new User({
    mail: userObj.mail,
    password: enpw,
    usertype_id: userObj.usertype_id,
    personal: {
      name: userObj.name,
      nrc: userObj.nrc,
      ph_no: userObj.ph_no,
      dob: userObj.dob,
      profile_img: userObj.profile_img,
      status_flag: 0
    },
    academic_histories: {
      student_id: userObj.student_id,
      idCard_imgs: userObj.idCard_imgs,
      role_no: userObj.role_no,
      university_id: userObj.university_id,
      major_id: userObj.major_id,
      attended_year: userObj.attended_year,
      degree_id: userObj.degree_id,
      academic_started_year: userObj.academic_started_year,
      academic_ended_year: userObj.academic_ended_year,
      related_technical_infos: userObj.related_technical_infos,
      project_descriptions: userObj.project_description
    }
  });
  await user.save();

  if (userObj.idCard_imgs || userObj.profile_img) {
    var imageIdList = [];
    imageIdList.push(userObj.profile_img);
    for (let imgId of userObj.idCard_imgs) {
      imageIdList.push(imgId);
    }
    var imageObj = await Image.updateImage(user._id, imageIdList);
  }
  return user;
};

userSchema.statics.setIndexAndFind = async function(fieldName, searchKey) {
  try{
    await User.collection.createIndex({[fieldName] : "text"});
    await userSchema.index({[fieldName] : "text"} , { collation: { locale: "fr" } } )
    var reg = new RegExp(searchKey + '.*')
    var result = await User.find({
      [fieldName]: {$regex: reg, $options: 'si' } 
    })
    return(result)
  }catch(e) {
    console.log(e);
  }
}

userSchema.statics.deleteIndex = async function(fileldName) {
  try {
    await User.collection.dropIndexes({fileldName});
    var index = await User.collection.getIndexes();    
  }catch (e) {
    console.log(e);
    
  }
 }

/**Update user's information.
 * @param {JSON} params userObject
 * @return {JSON} userobj
 */
userSchema.statics.updateUser = async function(userObj) {
  var user = await User.findById(userObj.id);

  var originResource = [];
  originResource.push(user.personal.profile_img);
  for (let imgId of user.academic_histories.idCard_imgs) {
    originResource.push(imgId);
  }

  var resourceIdList = [];
  resourceIdList.push(userObj.profile_img);
  for (let imgId of user.academic_histories.idCard_imgs) {
    resourceIdList.push(imgId);
  }

  user = await User.findOneAndUpdate(
    { _id: userObj.id },
    {
      $set: {
        personal: {
          name: userObj.name,
          nrc: userObj.nrc,
          ph_no: userObj.ph_no,
          dob: userObj.dob,
          profile_img: userObj.profile_img
        },
        academic_histories: {
          student_id: userObj.student_id,
          idCard_img: userObj.idCard_imgs,
          role_no: userObj.role_no,
          university_id: userObj.university_id,
          major_id: userObj.major_id,
          attended_year: userObj.attended_year,
          degree_id: userObj.degree_id,
          academic_started_year: userObj.academic_started_year,
          academic_ended_year: userObj.academic_ended_year,
          related_technical_infos: userObj.related_technical_infos,
          project_descriptions: userObj.project_description
        },
        updated_by: userObj.admin_id,
        updated_date: new Date()
      }
    },
    { new: true }
  );

  var updateIdList = [];
  var find = false;
  for (let resourceId of resourceIdList) {
    find = false;
    for (let originResourceId of originResource) {
      if (resourceId == originResourceId) {
        find = true;
        break;
      }
    }
    if (!find) {
      updateIdList.push(resourceId);
    }
  }

  var deleteIdList = [];
  for (let originResourceId of originResource) {
    find = false;
    for (let resourceId of resourceIdList) {
      if (resourceId == originResourceId) {
        find = true;
        break;
      }
    }
    if (!find) {
      deleteIdList.push(originResourceId);
    }
  }

  var deleteImage = await Image.remove({
    _id: { $in: deleteIdList }
  });

  var updateImage = await Image.updateImage(userObj.id, updateIdList);

  return user;
};

userSchema.statics.updatePersonalStatusFlag = async function(
  userId,
  status_flag
) {
  var updatedResult = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: { "personal.status_flag": status_flag } },
    { new: true }
  );
  return updatedResult;
};

/**
 *Delete user's information.
 * @param {mongoose.Schema.Types.ObjectId} userId
 */
userSchema.statics.deleteUser = async function(userId) {
  var user = await User.findByIdAndRemove(userId);
  var deleteImageList = [];
  deleteImageList.push(user.personal.profile_img);
  for (let imgId of user.academic_histories.idCard_imgs) {
    deleteImageList.push(imgId);
  }
  var deleteImage = await Image.remove({
    _id: { $in: deleteImageList }
  });
  return deleteImage;
};

userSchema.statics.updateWrongUserInfo = async function(userId, wrong_infos) {
  var updatedResult = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: { "academic_histories.wrong_infos": wrong_infos } },
    { new: true }
  );
  return updatedResult;
};

userSchema.statics.getWrongInfo = async function(userId) {
  var findResult = await User.findOne({ _id: userId });
  var wrongInfo = findResult.academic_histories.wrong_infos;
  return wrongInfo;
};

var User = mongoose.model("User", userSchema);

module.exports = { User };
