var koa = require('koa');
var koaRouter = require('koa-router');
var staticServer = require('koa-static');
var views = require('koa-views');
var path = require('path');
var koaBody =require('koa-body');

const app = new koa();
const router = new koaRouter();
const port = process.env.NODE_ENV || 8888;
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());


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
router.post('/api/news/update', (ctx, next) => {
    // debugger
    let { data } = ctx.request.body;
    ctx.body = {
        retCode: '000000',
        status: 'success'
    }
    next();
})
router.post('/api/news/list', (ctx, next) => {
    let { data } = ctx.request.body;
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
