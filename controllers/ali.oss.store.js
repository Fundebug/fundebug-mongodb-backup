const OSS = require("ali-oss");
module.exports = OSS({
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "fundebug-shenzhen",
    region: "oss-cn-shenzhen",
    secure: true
});
