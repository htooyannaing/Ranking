const express = require("express");
const imgRouter = express.Router();
let multer = require("multer");
const { Image } = require("../models/Image");
let upload = multer({ storage: multer.memoryStorage() });

/**
 * Update user profile image.
 * @param {file} file single file
 * @returns Image Id.
 */
imgRouter.post("/profileImage", upload.single("file"), async function(
  req,
  res
) {
  // Bad Request from client
  if (!req.file) {
    return res.status(400).send();
  }
  // Save new profile image.
  var newItem = new Image();
  newItem.img.data = req.file.buffer;
  newItem.img.contentType = req.file.mimetype;
  newItem.isProfile = true;
  await newItem.save();
  res.send(newItem._id);
});

/**
 * Upload for user Id Card Images.
 * @param {file} file file list
 * @returns Image Id list.
 */
imgRouter.post("/photo", upload.array("file"), function(req, res) {
  // Bad Request from client
  if (!req.files) {
    return res.status(400).send();
  }

  var imageIdList = [];
  for (var file of req.files) {
    var newItem = new Image();
    newItem.img.data = file.buffer;
    newItem.img.contentType = file.mimetype;
    newItem.save();
    imageIdList.push(newItem._id);
  }

  res.send(imageIdList);
});

// Download image by image id.
imgRouter.get("/photo/:imageId", async function(req, res) {
  var imageId = req.params.imageId;
  var results = await Image.findById(imageId);
  res.setHeader("content-type", results.img.contentType);
  var temp = new Buffer(results.img.data).toString("base64");
  res.send(temp);
});

module.exports = imgRouter;
