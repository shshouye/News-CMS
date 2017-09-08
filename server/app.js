var koa = require('koa');
var koaRouter = require('koa-router');
var staticServer = require('koa-static');
// var ejs = require('ejs');
var views = require('koa-views');
var path = require('path');
var koaBody = require('koa-body');

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import mongo from './config/mongoose';
import mongoose from 'mongoose';

import NewsModel from './models/news';
import UserModel from './models/users';

const News = mongoose.model('news');
const Users = mongoose.model('users');

const app = new koa();
const router = new koaRouter();
const port = process.env.NODE_ENV || 8888;
var viewsPath = path.join(__dirname, '../frontend');


// app.use(ejs());
app.use(views(viewsPath, {
    map: {
        html: 'ejs'
    }
}));


app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());


var db = mongo();
db.connection.on("error", function (error) {
    console.log("------数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

//密码md5加密
function md5(str) {
    var ret = crypto.createHash('md5').update(str.toString()).digest('hex');
    return ret;
}
const expiredTime = 30 * 60;
const sKeys = 'shsh';
function generateToken(data) {
    var token = jwt.sign(data, sKeys, { expiresIn: expiredTime });
    return token;
}
function handleTokenError(ctx, msg) {
    ctx.cookies.set('token', '');
    switch (msg) {
        case 'jwt expired':
            ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: '未登录或者登录过期'});
            break;
        case 'invalid token':
            ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: '不可用的token'});
            break;
        case 'jwt malformed':
            console.log('------token hereA-----')
            ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: '非法token'});
            break;
        default:
            console.log('------token hereB-----')
            ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: '未登录或者登录过期'});
    }
}

async function authVerify(ctx, next) {
    const token = ctx.cookies.get('token');
    // debugger
    if (!token) {
        ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: '未登录或者登录过期'});
        return;
    }
    try {
        var tokenContent = await jwt.verify(token, sKeys);
        console.log('----------verify tokenContent:', tokenContent);
        console.log("Authentication success!");
        await next();

    } catch (err) {
        logger.error('---------------Verify Error:', err);
        if (err && err.message) {
            handleTokenError(ctx, err.message);
        } else {
            ctx.body = Object.assign({ data: null }, {retCode: '999999', msg: 'token解析错误'});
        }
    }
}

router.post('/api/user/login', async (ctx, next) => {
    // debugger
    let params = ctx.request.body;
    //密码加密
    var pwd = md5(params.password);
    let data = await Users.findOne({ name: params.name });
    if (data) {
        if (pwd == data._doc.password) {
            var tokenInfo = {
                name: params.name,
            };
            var token = generateToken(tokenInfo);
            ctx.cookies.set('token', token);
            ctx.body = {
                data: {
                    name: data._doc.name
                },
                retCode: '000000',
                msg: '登录成功'
            }
        } else {
            ctx.body = {
                retCode: '000010',
                msg: '密码错误'
            }
        }

    } else {
        ctx.body = {
            msg: '用户不存在',
            retCode: '000020'
        }
    }

})

router.post('/api/news/add', authVerify, async (ctx, next) => {
    // title, content
    let params = ctx.request.body;
    params.created = Date.now();
    params.updated = Date.now();
    let data = await News.create(params);
    // debugger
    if (data) {
        ctx.body = {
            retCode: '000000',
            data: data
        }
    } else {
        ctx.body = {
            retCode: '000010',
        }
    }
})
router.post('/api/news/update', authVerify, async (ctx, next) => {
    // id, title, content
    let params = ctx.request.body;
    params.updated = Date.now();
    let data = await News.update({ _id: params.id }, params);
    if (data) {
        let updateData = await News.findById(params.id);
        if (updateData) {
            ctx.body = {
                retCode: '000000',
                data: updateData
            }
        } else {
            ctx.body = {
                retCode: '000010',
            }
        }
    } else {
        ctx.body = {
            retCode: '000020'
        }
    }
})

router.post('/api/news/delete', authVerify, async (ctx, next) => {
    let { id } = ctx.request.body;
    let data = await News.remove({ _id: id });
    // debugger
    if (data && data.result.n == 1) {
        ctx.body = {
            retCode: '000000',
        }
    } else {
        ctx.body = {
            retCode: '000010',
        }
    }
})
router.get('/api/news/getList', authVerify, async (ctx, next) => {
    let data = await News.find();
    if (data) {
        ctx.body = {
            retCode: '000000',
            data: data
        }
    } else {
        ctx.body = {
            retCode: '000010'
        }
    }
})

router.get('/api/news/getByID', authVerify, async (ctx, next) => {
    let { id } = ctx.query;
    let data = await News.findById(id);
    if (data) {
        ctx.body = {
            retCode: '000000',
            data: data
        }
    } else {
        ctx.body = {
            retCode: '000010'
        }
    }
})


app.use(async function (ctx, next) {
    var cPath = ctx.path;
    var html = cPath.replace(/^\/+/, '');

    if (ctx.method != "HEAD" && (cPath.indexOf('.html') != -1 || cPath == "/")) {
        await ctx.render(html || 'index', {
            title: 'ejs-demo',

        })
    } else {
        await next();
    }


    //   debugger
    // var cPath = ctx.path;
    // var html =  cPath.replace(/^\/+/, '');
    // debugger
    // await ctx.render(html || 'index', {
    //     title: '登录页'
    // });

    // await ctx.render('list', {
    //     title: '列表页',
    //     data: [{
    //         title: '1',
    //         content: '11',
    //         created: '111',
    //         updated: '1111',
    //         id: 1
    //     },
    //     {
    //         title: '2',
    //         content: '22',
    //         created: '222',
    //         updated: '2222',
    //         id: 2
    //     },
    //     {
    //         title: '3',
    //         content: '33',
    //         created: '333',
    //         updated: '3333',
    //         id: 3
    //     },
    //     {
    //         title: '4',
    //         content: '44',
    //         created: '444',
    //         updated: '4444',
    //         id: 4
    //     }]
    // });
    // await ctx.render('edit', {
    //     title: '编辑页',
    // });

});

app.use(staticServer(viewsPath));

app.listen(port, () => {
    // logger.info('Server started on port ' + port);
    console.log('Server started on port ' + port);
});
