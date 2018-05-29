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
console.log(MONGODB_URI);
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
            if (!element.animeType) {
                element.animeType = [];
            }
            if (!element.imageType) {
                element.imageType = "jpg";
            }
            if (!element.wmsLayerName) {
                element.wmsLayerName = "";
            }
            replaceIP(element);
            // console.log(element);
            //    updateProjectInfo(element);
        });
    }
    mongoose.disconnect();
});


function replaceIP(element) {
    var baseIP = "4.130";
    var newIP = "10.95";
    element.dataListUrl = element.dataListUrl.replace(baseIP, newIP);
    element.paletteUrl = element.paletteUrl.replace(baseIP, newIP);
    element.animeUrl = element.animeUrl.replace(baseIP, newIP);

    // console.log(element.dataListUrl);
}
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
            layerRange: element.layerRange,
            animeType: element.animeType,
            imageType: element.imageType,
            wmsLayerName: element.wmsLayerName
        }
    }, function (err) {
        console.log("ok");
        if (err) {
            console.log(err);
        }
    });
}