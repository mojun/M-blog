require('./debug-helper');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var flash = require('express-flash');
// https://www.npmjs.com/package/session-mongoose
var SessionStore = require('session-mongoose')(connect);

var settings = require('./settings.js');
require('./models');

debugInfo('>>>>: ' + settings.dbUrl());
debugInfo('>>>>: ' + settings.sessionDbUrl());

var authMiddleware = require('./middlewares/auth.js');
var routes = require('./routes/index.js');
var userRoutes = require('./routes/users.js');

// 生成一个express实例app
var app = express();

// view engine setup
// 设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
var ejs = require('ejs');
app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
// 设置视图模板引擎为 ejs
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var store = new SessionStore({
    url: settings.sessionDbUrl(),
    interval: 120000
});
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: settings.sessionSecret,
  key: settings.sessionDb,
  cookie: {maxAge: settings.defaultExpirationTime},
  store: store
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.title = settings.siteName;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users/', userRoutes);

app.use(authMiddleware.authUser);


// catch 404 and forward to error handler
app.use(function(req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404');
  // next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

} else {
  // production error handler
// no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

debugInfo('你目前的环境是: ' + app.get('env'));

module.exports = app;


var kiss = require('./test/kiss.js');

