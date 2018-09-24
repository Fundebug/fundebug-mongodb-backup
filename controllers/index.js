const express = require("express");
const config = require("config");
const morgan = require("morgan");
const log4js = require("log4js");
const logger = log4js.getLogger();
const Upload = require("./upload.js");
const Download = require("./download.js");

// 使用Fundebug监控报错：https://docs.fundebug.com/notifier/nodejs/
const fundebug = require("fundebug-nodejs");
fundebug.apikey = "API-KEY";

const port = config.get("port");

var app = express();
var router = new express.Router();

app.use(
    morgan("short", {
        stream: {
            write: function(str) {
                logger.debug(str);
            }
        }
    })
);

router.get("/upload", Upload.uploadDataToAliOSS);
router.get("/download", Download.downloadDataToAliOSS);

// API不存在时返回404
router.use("/*", function(req, res, next) {
    var err = new Error("API Not Found");
    err.status = 404;
    next(err);
});

app.use(router);

// 生产环境和开发环境错误处理
app.use(function(err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.json({
        error: err.message,
        code: err.code
    });
    next(err);
});

// Fundebug错误监控插件应该放在其他中间件之后，并放在其他错误处理中间件之后
app.use(fundebug.ExpressErrorHandler);

app.listen(port, function() {
    logger.info(
        `mongodb-backup listen on port ${port}, in ${process.env.NODE_ENV} mode`
    );
});

module.exports = app;
