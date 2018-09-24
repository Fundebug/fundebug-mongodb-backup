const Promise = require("bluebird");
const fs = require("fs");
var log4js = require("log4js");
var logger = log4js.getLogger();
const store = require("./ali.oss.store.js");
const fundebug = require("fundebug-nodejs");

exports.uploadDataToAliOSS = async function(req, res, next) {
    try {
        const backup_path = "/data/mongodb_backup";
        const directory = fs.readdirSync(backup_path)[0];
        const files = getFilesToUpload(backup_path, directory);
        logger.info(files);
        // 逐一上传每个文件
        await Promise.mapSeries(files, async file => {
            logger.info(`start to upload ${file}`);
            await uploadFile(
                `${directory}/${file}`,
                `${backup_path}/${directory}/fundebug-production/${file}`
            );
        });
        logger.info("upload all files success!\n\n");
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

// 上传单个文件
async function uploadFile(fileName, filePath) {
    try {
        const result = await store.multipartUpload(fileName, filePath, {
            parallel: 4,
            partSize: 1024 * 1024,
            progress: function(p) {
                logger.info("Progress: " + p);
            }
        });
        if (result.res.statusCode === 200) {
            logger.info(`upload file success! ${fileName}`);
        } else {
            const message = `upload file fail! ${fileName}`;
            logger.error(message);
            logger.error(result);
            fundebug.notifyError(new Error(message), {
                metaData: {
                    message: message,
                    result: result
                }
            });
        }
    } catch (error) {
        const message = `upload file fail! ${fileName}`;
        logger.error(message);
        logger.error(error);
        fundebug.notifyError(error, {
            metaData: {
                message: message,
                error: error
            }
        });
    }
}

function getFilesToUpload(backup_path, directory) {
    let files = fs.readdirSync(
        `${backup_path}/${directory}/fundebug-production`
    );

    // 只上传加密的.gpg文档
    files = files.filter(file => {
        return file.endsWith(".gpg");
    });

    return files;
}
