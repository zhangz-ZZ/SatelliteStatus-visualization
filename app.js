var path = require("path");
var express = require("express");
var morgan = require("morgan");
var onFinished = require("on-finished");
var bodyParser = require("body-parser");
var argvs = process.argv.splice(2);
var PORT = process.env.PORT || argvs[0] || 4600;

var NotFoundError = require("./lib/NotFoundError.js");



var app = express();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./app")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method === "OPTIONS") {
    res.send(200); //让options请求快速返回
  } else {
    next();
  }
});
app.use(function (req, res, next) {
  onFinished(res, function () {
    console.log("[%s] finished request", req.connection.remoteAddress);
  });
  next();
});

//=======================此处引入自己的路由文件======================
app.use(require("./routers/user.js")());


//=================================================================

app.use("*", function (req, res, next) {
  next(new NotFoundError("404"));
});
// 错误处理中间件 （所有错误应在此处理 而不是在其他中间件中处理）
app.use(function (err, req, res) {
  var code = 500;
  var msg = err.stack || {
    message: "Internal Server Error 1"
  };
  switch (err.name) {
    case "NotFoundError":
      code = err.status;
      msg = err.inner;
      break;
    default:
      break;
  }
  return res.status(code).json(msg);
});
require("http")
  .createServer(app)
  .listen(PORT, function () {
    console.log(
      "HTTP Server listening on port: %s, in %s mode",
      PORT,
      app.get("env")
    );
  });