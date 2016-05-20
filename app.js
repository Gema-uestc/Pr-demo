
/**
 * Module dependencies.
 */

var express = require('express');//引入模块
var routes = require('./routes');//引入routes
var user = require('./routes/user');//引入user
var http = require('http');//引入http
var path = require('path');//一如path
var ejs = require('ejs');
var SessionStore = require("session-mongoose")(express);//引入session
var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000
});//引入store,连接到本地数据库


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);//3000端口
app.set('views', path.join(__dirname, 'views'));//设置views路径，取得执行js所在的路径
app.engine('html',ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());//Connect內建的，可以协助处理POST请求伪装PUT、DELETE和其他HTTP methods
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'vamcc'}));
app.use(express.session({
    secret: 'vamcc',
    store: store,
    cookie: {maxAge: 900000}
}));
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.hint = req.session.hint;
    var err = req.session.error;
    var success = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err)
        res.locals.message = '<div class="alert alert-warning">    ' + err + '</div>';
    else if (success)
        res.locals.message = '<div class="alert alert-success">    ' + success + '</div>';
    next();
});//路由和request处理
app.use(app.router);//可有可无
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});//增加listen
