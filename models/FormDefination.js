const mongoose = require("mongoose");
const { University } = require("../models/University");
var Schema = mongoose.Schema;

var formDefinationSchema = new Schema({
  //0: Create , 2: Update, 3:Search
  type: Number,
  table_name: String,
  columns: [
    {
      column_name: String,
      column_full_name: String,
      own_table: String,
      control_type: {
        // 1:Text, 2: Combo
        type: Number
      },
      req: Boolean,
      min_length: Number,
      max_length: Number,
      from_date: Date,
      to_date: Date,
      ref_table: String,
      ref_column: String,
      ref_return_value: {
        key: mongoose.Schema.Types.ObjectId,
        value: String
      },
      disable: Boolean,
      requests: {
        value: String,
        from: Date,
        to: Date,
        // 1 : Equal , 2: Unequal
        conditions: {
          type: Number,
          default: 1
        }
      }
    }
  ]
});

/**
 * Register formDefination data.
 * @param {JSON} param formDefinationObj.
 */
formDefinationSchema.statics.registerData = async function(data) {
  try {
    var data = new FormDefination({
      type: data.type,
      table_name: data.table_name,
      columns: data.columns
    });
    var result = await data.save();
    return result;
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Get formDefination Datas.
 * @param {String} table_name
 * @returns formDefinationDataObj lists.
 */
formDefinationSchema.statics.getDataList = async function(table_name) {
  var controlTypeOneList = [];
  var uniDataList = [];
  var uninameList = [];

  try {
  var dataObj = await FormDefination.findOne({ table_name: table_name });
  if (!dataObj) {
    return "Table is not defined";
  }
  var universityList = await University.find();
  for (let universityObj of universityList) {
    var degreeArr = [];
    var majorsArr = [];
    var uninameObj = {
      id: universityObj.id,
      uniname: universityObj.uniname,
      //uni_short_name: universityObj.uni_short_name,
      combo: ["degree", "major"]
    };
    uninameList.push(uninameObj);
    var degreeList = universityObj.degree;
    for (let degreeObj of degreeList) {
      var degree = {
        name: degreeObj.degree_name,
        short_name: degreeObj.degree_short_name
      };
      degreeArr.push(degree);
    }
    var majorList = universityObj.majors;
    for (let majorObj of majorList) {
      var major = {
        name: majorObj.major_name,
        short_name: majorObj.major_short_name
      };
      majorsArr.push(major);
    }
    var uni = {
      uniname: universityObj.uniname,
      degree: degreeArr,
      majors: majorsArr
    };
    uniDataList.push(uni);
  }

  var columnList = dataObj.columns;

  for (let columnObj of columnList) {
    var data = {
      column_full_name: columnObj.column_full_name,
      column_name: columnObj.column_name,
      control_type: columnObj.control_type
    };
    controlTypeOneList.push(data);
  }

  if (table_name == "User") {
    return { User: controlTypeOneList };
  } else {
    return { University: controlTypeOneList, uninameList, uniDataList };
  }
}catch(e) {
    console.log(e);
    return(e.message);
  }
};

var FormDefination = mongoose.model("FormDefination", formDefinationSchema);

module.exports = { FormDefination };
