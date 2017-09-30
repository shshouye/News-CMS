'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logConfig = exports.config = undefined;

var _path = require('path');

const config = {
    mongodb: 'mongodb://127.0.0.1:27020/newsCms',
    jwt: {
        secret: 'shsh'
    }

    // Config for log4js.
};const logConfig = {
    appenders: [{
        "type": "dateFile",
        "filename": (0, _path.resolve)(__dirname, "../../logs/server.log"),
        "pattern": "-yyyy-MM-dd.log",
        "category": "server"
    }, {
        "type": "dateFile",
        "filename": (0, _path.resolve)(__dirname, "../../logs/mongodb.log"),
        "pattern": "-yyyy-MM-dd.log",
        "category": "mongodb"
    }]
};

exports.config = config;
exports.logConfig = logConfig;