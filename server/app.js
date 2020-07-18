var express = require('express');
const expressNunjucks = require('express-nunjucks');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var morgan = require('morgan')
var MongoStore = require('connect-mongo')(session);
var User = require('./schema/user')
const isDev = app.get('env') === 'development';

app.use('/static',express.static(__dirname+'/static'));
app.set('views', __dirname + '/views');
require('./auth')(app)


var mongoDB = 'mongodb://127.0.0.1/task_mgmt';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

var user_session;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  secret: 'timeismoreimportant',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/test-app'
  }),
  cookie: {
      expires: 600000
  }
}));

app.use(passport.initialize())
app.use(passport.session())

app.get('/', passport.authenticationMiddleware(), (req, res) => {
  res.render('index', { title: 'Welcome'});
});

app.get('/login/', (req, res) => {
  res.render('login');
});

app.post('/check-email', (req, res) => {
  User.find({'email': req.query.email}).exec(function(err, user) {
    if (err) return next(err)
    
    if(user.length != 0) {
      res.json({
        available: false,
        messsage: 'Email address not available.'
      })
    } else {
      res.json({
        available: true,
        messsage: 'Email address available.'
      })
    }
  })
})

app.post('/check-username', (req, res) => {
  User.find({'username': req.query.username}).exec(function(err, user) {
    if (err) return next(err)
    
    if(user.length != 0) {
      res.json({
        available: false,
        messsage: 'Username not available.'
      })
    } else {
      res.json({
        available: true,
        messsage: 'Username address available.'
      })
    }
  })
})

app.post('/register', (req, res, next) => {
  console.log(req.body)
  var user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    profile_completed: req.body.profile_completed
  })

  user_session = req.session;
  user_session.email=req.body.email;

  user.save(function(err) {
    if (err) return next(err)
    res.json({
      "user": user
    })
  })
})

app.get('/profile/', passport.authenticationMiddleware(), (req, res, next) => {
  res.render('profile')
})

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    
    if (!user) { 
      return res.json({
        auth: false,
        messsage: 'Incorrect User name or password'
      }); 
    }
    
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({
        auth: true,
        redirect: '/'
      });
    });
  })(req, res, next);
});

app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/login/');
  });
});

app.use(function (req, res, next) {
  res.status(404).render("404")
});

app.listen(3001);
console.log("app running at http://localhost:3001");

