var koa = require('koa');
var koaRouter = require('koa-router');
var staticServer = require('koa-static');
// var ejs = require('ejs');
var views = require('koa-views');
var path = require('path');
var koaBody = require('koa-body');

import mongo from './config/mongoose';

import newsModel from './models/news';


const app = new koa();
const router = new koaRouter();
const port = process.env.NODE_ENV || 8888;
var viewsPath = path.join(__dirname, '../frontend');
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
// app.use(ejs());
app.use(views(viewsPath, {
    // map: {
    //     html: 'ejs'
    // },
    extension: 'ejs'
}));

app.use(staticServer(viewsPath));





var db = mongo();
db.connection.on("error", function (error) {
    console.log("------数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});


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
    } else {
        ctx.body = {
            retCode: '000010',
        }
    }
})
router.post('/api/news/update', async (ctx, next) => {
    // debugger
    let params = ctx.request.body;
    params.updated = Date.now();
    let data = await newsModel.updated(params);
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

router.post('/api/news/delete', async (ctx, next) => {
    let { id } = ctx.request.body;
    let data = await newsModel.remove(id);
    if(data) {
        ctx.body = {
            retCode: '000000',
        }
    } else {
        ctx.body = {
            retCode: '000010',
        }
    }
})
router.get('/api/news/list', async (ctx, next) => {
    // let { data } = ctx.request.body;
    // let newsList = await newsModel
    let data = await newsModel.find();
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

router.get('/api/news/getByID', async (ctx, next) => {
    let { id } = ctx.query;
    // let newsList = await newsModel
    let data = await newsModel.findOne(id);
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
    //   debugger
    await ctx.render('index', {
        title: '登录页'
    });

    await ctx.render('list', {
        title: '列表页',
        data: [{
            title: '1',
            content: '11',
            created: '111',
            updated: '1111',
            id: 1
        },
        {
            title: '2',
            content: '22',
            created: '222',
            updated: '2222',
            id: 2
        },
        {
            title: '3',
            content: '33',
            created: '333',
            updated: '3333',
            id: 3
        },
        {
            title: '4',
            content: '44',
            created: '444',
            updated: '4444',
            id: 4
        }]
    });
    await ctx.render('edit', {
        title: '编辑页',

    });

});

app.listen(port, () => {
    // logger.info('Server started on port ' + port);
    console.log('Server started on port ' + port);
});
