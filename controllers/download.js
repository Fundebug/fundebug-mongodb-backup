const Promise = require("bluebird");
const moment = require("moment");
const request = require("request");
Promise.promisifyAll(request);
const fs = require("fs");
var log4js = require("log4js");
var logger = log4js.getLogger();
const store = require("./ali.oss.store.js");
const fundebug = require("fundebug-nodejs");

exports.downloadDataToAliOSS = async function(req, res, next) {
    try {
        const day = moment().format("YYYYMMDD");
        const dir = moment().format("YYYYMMDDHHmmss");
        const path = `./DATA/${dir}`;
        fs.mkdirSync(path);
        const files = await listFilesToDownload(day);
        await Promise.mapSeries(files, async file => {
            logger.info(`start to download file: ${file.name}`);
            await downloadFile(file.name, path);
            logger.info(`download file success! ${file.name}`);
        });
        logger.info("download all file success!");
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

// 获取当天上传到阿里OSS的文件列表
async function listFilesToDownload(day) {
    const result = await store.list({ prefix: day });
    return result.objects;
}

// 将阿里云OSS中的文件下载到本地
async function downloadFile(fileName, path) {
    try {
        const file = fileName.split("/")[1];
        const filepath = `${path}/${file}`;
        await store.get(fileName, filepath);
    } catch (error) {
        const message = `download file fail! ${fileName}`;
        logger.error(message);
        logger.error(error);
        fundebug.notifyError(error, {
            metaData: {
                error: error,
                message: message
            }
        });
    }
}
