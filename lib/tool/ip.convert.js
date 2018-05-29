 var CONFIG = require("../../config.json");
 var ProjectInfoSchema = require("../schemas/projectinfo-schema.js");

 //=================连接数据库=========================
 // 如不需要连接数据可可删除此段代码
 var mongoose = require("mongoose");
 var MONGODB_URI =
     process.env.MONGODB_URI || CONFIG.mongodb.connectStr;
 var optMongoose = {
     useMongoCLient: true
 };
 if (MONGODB_URI) {
     mongoose.connect(MONGODB_URI, optMongoose);
     mongoose.connection.on("error", function (err) {
         console.error("Mongoose connection error: %s", err.stack);
     });
     mongoose.connection.on("open", function () {
         console.log("Mongoose connected.");
     });
     mongoose.Promise = global.Promise;
 } else {
     console.error("Not set MONGODB_URI, MongoDB did not connect.");
 }

 //===================================================

 function getProjectInfoList(cb) {
     ProjectInfoSchema
         .find()
         .exec(function (err, doc) {
             cb(err, doc);
         });
 }

 getProjectInfoList(function (err, data) {
     if (!err) {
         data.forEach(element => {
             if (element.animeUrl.indexOf(" ") > 0) {
                 element.animeUrl = element.animeUrl.replace(" ", "");
                 console.log(element.animeUrl);
                 updateProjectInfo(element);
             }
         });
     }
    // mongoose.disconnect();
 });

 /**
  * update 产品信息
  * 
  * @param {any} element 
  */
 function updateProjectInfo(element) {
     console.log(element);
     //如果body内数据正确
     ProjectInfoSchema.update({
         _id: element._id
     }, {
         $set: {
             layerName: element.layerName,
             satID: element.satID,
             instID: element.instID,
             satType: element.satType,
             projectName: element.projectName,
             layType: element.layType,
             projectUrl: element.projectUrl,
             mapType: element.mapType,
             isDefault: element.isDefault,
             dataListUrl: element.dataListUrl,
             paletteUrl: element.paletteUrl,
             screenshotUrl: element.screenshotUrl,
             screenshotparam: element.screenshotparam,
             animeUrl: element.animeUrl,
             layerRange: element.layerRange
         }
     }, function (err) {
         console.log("ok");
         if (err) {
             console.log(err);
         }
     });
 }

 /**
  * 数据api 转化
  * 
  * @param {any} convert_element 
  * @returns 
  */
 function convertDataAPI(convert_element) {
     var DataApi = convert_element.dataListUrl.toString();
     var DataApisp = DataApi.split('/');
     console.log(DataApisp[7] + ":" + DataApisp[8]);
     var api_1 = "http://10.24.4.130:4001/satelliteview/datalist/fy4?satID=FY4A&instID=AGRIX&prodName=" + DataApisp[7] + "&resolution=" + DataApisp[8] + "&projectType=GLL";
     console.log(api_1);
     convert_element.dataListUrl = api_1;
     return convert_element;
 }

 /**
  * 调色板转化
  * 
  * @param {any} convert_element 
  * @returns 
  */
 function convert_Palette(convert_element) {
     var paletteUrl = convert_element.paletteUrl;
     var paletteUrlsp = paletteUrl.split("/");
     console.log(paletteUrlsp[5] + ":" + paletteUrlsp[6]);
     if (paletteUrlsp[6].indexOf("json") > 0) {
         //console.log(convert_element);
         var patn1 = paletteUrlsp[5];
         var name = paletteUrlsp[6].replace("json", "cb");
         var api_1 = "http://10.24.4.130:4001/satelliteview/palette?path=" + patn1 +
             "&name=" + name +
             "&showType=gradient";
         console.log(api_1);
         convert_element.paletteUrl = api_1;
         // updateProjectInfo(convert_element)
     }
     return convert_element;
 }

 /**
  * 动画API 转化
  * 
  * @param {any} convert_element 
  * @returns 
  */
 function convert_Animate(convert_element) {
     console.log(convert_element.projectName);
     var dataListUrl = convert_element.dataListUrl;
     var projectUrl = convert_element.projectUrl;
     dataListUrl = dataListUrl.replace("datalist", "animate");
     var animeUrl = dataListUrl + "&isLight=false&url=" + projectUrl;
     console.log(animeUrl);
     convert_element.animeUrl = animeUrl;
     return convert_element;
 }