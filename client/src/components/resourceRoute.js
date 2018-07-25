const express = require('express');
var objectId = require('mongodb').ObjectID;
const route = express.Router();
const { Resource } = require('./../models/Resource');
const { Museum } = require('./../models/Museum');
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});

route.post("/upload",upload.array("files",5), async (req,res) => {
    
    var resourceIdList = [];
    try {
        for(let  file of req.files ) {
            var newItem = new Resource();
            newItem.img.data = file.buffer;
            newItem.img.contentType = file.mimetype;
            var result = await newItem.save();
            resourceIdList.push(result._id);
        }
         res.send(resourceIdList);
    } catch(e) {
        res.status(400).send(e);
    }
    
})

route.get('/download/:imageId', async (req,res) => {
    var imageId = req.params.imageId;
    if(objectId.isValid(imageId)) {
    try {
        var result = await Resource.findById(imageId);
        res.setHeader("content-type",result.img.contentType);
        res.send(result.img.data);
    } catch(e) {
        res.status(400).send(e);
    }    
  }
})
  route.get('/image', async (req,res) => {
    var imageId = req.params.imageId;
    
    try {
        var result = await Resource.find();
        //res.setHeader("content-type",result.img.contentType);
        res.send(result);
    } catch(e) {
        res.status(400).send(e);
    }    
  
});

 route.get('/museum', async (req,res) => {
     var result = await Museum.find();
     res.send(result);
 })
 
module.exports = route;