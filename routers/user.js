var Router = require("express").Router;

module.exports = function () {
    var router = new Router();
    router.route("/YGView").get(sendYGViewHTML);
   
    return router;
}

function sendYGViewHTML(req, res) {
    res.status(200).sendfile("./app/YG_visualization.html");
}

 