"use strict";
exports.__esModule = true;
exports.startup = void 0;
var express = require("express");
var startup = function (port) {
    if (port === void 0) { port = 3001; }
    var app = express();
    app.get("/", function (req, res) {
        res.send({ message: "hello world" });
    });
    app.listen(port, "0.0.0.0", function () {
        console.log("API listening on port " + port);
    });
};
exports.startup = startup;
(0, exports.startup)(parseInt(process.env.PORT || "3001"));
