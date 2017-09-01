var koa = require('koa');
var koaRouter = require('koa-router');
var staticServer = require('koa-static');
var views = require('koa-views');
var path = require('path');
var koaBody = require('koa-body');

import mongo from './config/mongoose';

import newsModel from './models/news';


const app = new koa();
const router = new koaRouter();
const port = process.env.NODE_ENV || 8888;
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

var viewsPath = path.join(__dirname, '../frontend');
app.use(views(viewsPath, {
    map: {
        html: 'ejs'
    },
    extension: 'html'
}));
// router.get('/', (ctx, next) => {
//     //输入密码
//     // ctx.body = "hello world";
//     ctx.redirect('/index.html');
// });
// router.get('/edit', (ctx, next) => {
//     //编辑页

// });
router.post('/api/news/add', async (ctx, next) => {
    // debugger
    let params = ctx.request.body;
    params.created = Date.now();
    params.updated = Date.now();
    let data = await newsModel.insert(params);
    if (data) {
        ctx.body = {
            retCode: '000000',
            data: data
        }
    }
})
router.post('/api/news/update', async (ctx, next) => {
    // debugger
    let { data } = ctx.request.body;
    ctx.body = {
        retCode: '000000',
        status: 'success'
    }
})
router.get('/api/news/list', async (ctx, next) => {
    let { data } = ctx.request.body;
    // let newsList = await newsModel
    ctx.body = {
        retCode: '000000',
        status: 'success'
    }
    // next();
})


app.use(staticServer(viewsPath));

app.listen(port, () => {
    // logger.info('Server started on port ' + port);
    console.log('Server started on port ' + port);
});
