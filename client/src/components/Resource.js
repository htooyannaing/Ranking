const mongoose = require('mongoose');

var ResourceSchema = new mongoose.Schema(
    {
        img: {
            data: Buffer,
            contentType : String,
            createUser : mongoose.Schema.Types.ObjectId,
            createDate : {
                type : Date,
                dafault : Date.now
            }
        }
    }
)


var Resource = mongoose.model('resources',ResourceSchema);
module.exports = { Resource };