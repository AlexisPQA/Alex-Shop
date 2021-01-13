require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const flash = require('connect-flash');
var hbs = require('express-handlebars')
var session = require('express-session');
const passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
const hbshelper = require('handlebars-helpers')
const multihelpers = hbshelper()


mongoose.connect(process.env.url, {useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;

require('./config/passport')(passport);

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


var indexRouter = require('./routes/index');
var productRouter = require('./routes/product')
var loginRouter = require('./routes/login')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
	  mongooseConnection: db
	})
  }));

app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine("hbs", hbs({
	extname: "hbs",
	helpers : multihelpers,
	defaultLayout:false,
	layoutsDir : __dirname + "/views/layout/",
	paritalsDir: __dirname + "/views/paritals/",
	runtimeOptions:{
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault:true,
	},
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/index', indexRouter);
app.use('/products',productRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
