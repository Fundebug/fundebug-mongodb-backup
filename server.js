var fundebug = require("fundebug-nodejs");
fundebug.apikey =
    "a73f74761b778c666f16980408bbd6cbdae9f222667e9648ba6181686de7aeba";

// 默认ENV为"development"
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

require("./controllers");
