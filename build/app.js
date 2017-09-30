'use strict';

let authVerify = (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        const token = ctx.cookies.get('token');
        // debugger
        if (!token) {
            ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: '未登录或者登录过期' });
            return;
        }
        try {
            var tokenContent = yield _jsonwebtoken2.default.verify(token, sKeys);
            console.log('----------verify tokenContent:', tokenContent);
            console.log("Authentication success!");
            yield next();
        } catch (err) {
            if (err && err.message) {
                handleTokenError(ctx, err.message);
            } else {
                ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: 'token解析错误' });
            }
        }
    });

    return function authVerify(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('./config/mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoose3 = require('mongoose');

var _mongoose4 = _interopRequireDefault(_mongoose3);

var _news = require('./models/news');

var _news2 = _interopRequireDefault(_news);

var _users = require('./models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var koa = require('koa');
var koaRouter = require('koa-router');
var staticServer = require('koa-static');
// var ejs = require('ejs');
var views = require('koa-views');
var path = require('path');
var koaBody = require('koa-body');

const News = _mongoose4.default.model('news');
const Users = _mongoose4.default.model('users');

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

var db = (0, _mongoose2.default)();
db.connection.on("error", function (error) {
    console.log("------数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

//密码md5加密
function md5(str) {
    var ret = _crypto2.default.createHash('md5').update(str.toString()).digest('hex');
    return ret;
}
const expiredTime = 30 * 60;
const sKeys = 'shsh';
function generateToken(data) {
    var token = _jsonwebtoken2.default.sign(data, sKeys, { expiresIn: expiredTime });
    return token;
}
function handleTokenError(ctx, msg) {
    ctx.cookies.set('token', '');
    switch (msg) {
        case 'jwt expired':
            ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: '未登录或者登录过期' });
            break;
        case 'invalid token':
            ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: '不可用的token' });
            break;
        case 'jwt malformed':
            console.log('------token hereA-----');
            ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: '非法token' });
            break;
        default:
            console.log('------token hereB-----');
            ctx.body = Object.assign({ data: null }, { retCode: '999999', msg: '未登录或者登录过期' });
    }
}

router.post('/api/user/login', (() => {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
        // debugger
        let params = ctx.request.body;
        //密码加密
        var pwd = md5(params.password);
        let data = yield Users.findOne({ name: params.name });
        if (data) {
            if (pwd == data._doc.password) {
                var tokenInfo = {
                    name: params.name
                };
                var token = generateToken(tokenInfo);
                ctx.cookies.set('token', token);
                ctx.body = {
                    data: {
                        name: data._doc.name
                    },
                    retCode: '000000',
                    msg: '登录成功'
                };
            } else {
                ctx.body = {
                    retCode: '000010',
                    msg: '密码错误'
                };
            }
        } else {
            ctx.body = {
                msg: '用户不存在',
                retCode: '000020'
            };
        }
    });

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})());

router.post('/api/news/add', authVerify, (() => {
    var _ref3 = _asyncToGenerator(function* (ctx, next) {
        // title, content
        let params = ctx.request.body;
        params.created = Date.now();
        params.updated = Date.now();
        let data = yield News.create(params);
        // debugger
        if (data) {
            ctx.body = {
                retCode: '000000',
                data: data
            };
        } else {
            ctx.body = {
                retCode: '000010'
            };
        }
    });

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})());
router.post('/api/news/update', authVerify, (() => {
    var _ref4 = _asyncToGenerator(function* (ctx, next) {
        // id, title, content
        let params = ctx.request.body;
        params.updated = Date.now();
        let data = yield News.update({ _id: params.id }, params);
        if (data) {
            let updateData = yield News.findById(params.id);
            if (updateData) {
                ctx.body = {
                    retCode: '000000',
                    data: updateData
                };
            } else {
                ctx.body = {
                    retCode: '000010'
                };
            }
        } else {
            ctx.body = {
                retCode: '000020'
            };
        }
    });

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
})());

router.post('/api/news/delete', authVerify, (() => {
    var _ref5 = _asyncToGenerator(function* (ctx, next) {
        let { id } = ctx.request.body;
        let data = yield News.remove({ _id: id });
        // debugger
        if (data && data.result.n == 1) {
            ctx.body = {
                retCode: '000000'
            };
        } else {
            ctx.body = {
                retCode: '000010'
            };
        }
    });

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
})());
router.get('/api/news/getList', (() => {
    var _ref6 = _asyncToGenerator(function* (ctx, next) {
        let data = yield News.find();
        if (data) {
            ctx.body = {
                retCode: '000000',
                data: data
            };
        } else {
            ctx.body = {
                retCode: '000010'
            };
        }
    });

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
})());

router.get('/api/news/getByID', authVerify, (() => {
    var _ref7 = _asyncToGenerator(function* (ctx, next) {
        let { id } = ctx.query;
        let data = yield News.findById(id);
        if (data) {
            ctx.body = {
                retCode: '000000',
                data: data
            };
        } else {
            ctx.body = {
                retCode: '000010'
            };
        }
    });

    return function (_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
})());

app.use((() => {
    var _ref8 = _asyncToGenerator(function* (ctx, next) {
        var cPath = ctx.path;
        var html = cPath.replace(/^\/+/, '');

        if (ctx.method != "HEAD" && (cPath.indexOf('.html') != -1 || cPath == "/")) {
            yield ctx.render(html || 'index', {
                title: 'News'

            });
        } else {
            yield next();
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

    return function (_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
})());

app.use(staticServer(viewsPath));

app.listen(port, () => {
    console.log('Server started on port ' + port);
});