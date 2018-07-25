const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var imageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  },
  created_by: mongoose.Schema.Types.ObjectId,
  created_date: {
    type: Date,
    default: Date.now
  },
  isProfile: Boolean
});

/**
 *After user registration or update, updated the image information.
 * @param {mongoose.Schema.Types.ObjectId} userId
 * @param imgIdList array
 * @returns update image id list
 */
imageSchema.statics.updateImage = async function(userId, imgIdList) {
  var imgUpdateList = [];
  for (let imgId of imgIdList) {
    var imgUpdate = await Image.update(
      { _id: imgId },
      { $set: { created_by: userId } },
      { new: true }
    );
    imgUpdateList.push(imgUpdate);
  }
  return imgUpdateList;
};

var Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
