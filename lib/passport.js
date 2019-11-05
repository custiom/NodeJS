const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
var authData = {
    email:'egoing777@gmail.com',
    password:'111111',
    nickname:'egoing'
}
module.exports = function(app){
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        done(null, user.email);
      });
      
      passport.deserializeUser(function(id, done) {
        done(null, authData);
      });
      
      passport.use(new LocalStrategy(
      {
        usernameField : 'email',
        passwordField : 'pwd'
      },
      (username, password, done) => {
        if(username === authData.email){
          if(password === authData.password){
            done(null, authData, {message: 'welcome.'});
          } else {
            done(null, false, { message: 'Incorrect password.' });
          }
        } else {
          done(null, false, { message: 'Incorrect username.' });
        }
      }));
      return passport;
}

