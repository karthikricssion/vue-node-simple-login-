const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../schema/user')

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login/')
  }
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function initPassport () {
  passport.use(new LocalStrategy((username, password, done) => {
    // console.log("Login authentication", req.body.username, req.body.password)
    // var username = req.body.username
    // var password = req.body.password
    User.find({'username': username}).exec(function(err, user) {
      if (err) return done(err)
      var tmp_user;
      if(user.length != 0) {
        tmp_user = user[0]
        if(tmp_user.password == password) {
          return done(null, tmp_user)
        } else {
          return done(null, false)
        }
      } else {
        return done(null, false)
      }
    })
  }))
  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport