/**
 * @overview: news model.
 * @author: shsh
 * @created 2017-08-31
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// 定义数据库中的集合名称（相当于 MySQL 数据库中的表名），如果有则保存到该集合，如果没有则创建名为 cims_users 的集合后保存数据。
const COLLECTTION = 'news';


// 定义news的数据模型。
var NewsSchema = new Schema({
    title: String,
    content: String,
    created: Number,
    updated: Number
});

NewsSchema.set('autoIndex', true);

// 根据Schema创建一个Model
var NewsModel = mongoose.model(COLLECTTION, NewsSchema);

export default NewsModel;