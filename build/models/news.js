'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

// 定义数据库中的集合名称（相当于 MySQL 数据库中的表名），如果有则保存到该集合，如果没有则创建名为 cims_users 的集合后保存数据。
/**
 * @overview: news model.
 * @author: shsh
 * @created 2017-08-31
 */

const COLLECTTION = 'news';

// 定义news的数据模型。
var NewsSchema = new Schema({
    title: String,
    content: String,
    tips: String,
    created: Number,
    updated: Number
}, {
    versionKey: false
});

// NewsSchema.set('autoIndex', true);

// 根据Schema创建一个Model
var NewsModel = _mongoose2.default.model(COLLECTTION, NewsSchema);

exports.default = NewsModel;