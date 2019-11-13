const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const lowDB = require('../lib/lowdb');
const bcrypt = require('bcrypt');

module.exports = function(app){
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        console.log('serialize', user);
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        var user = lowDB.get('users').find({id:id}).value();
        console.log('deserialize', id, user);
        done(null, user);
    });
      
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'pwd'},
        (email, password, done) => {
            var user = lowDB.get('users').find({email:email}).value();
            if(user){
                bcrypt.compare(password, user.password, (err, result) =>{
                    if(result){
                        done(null, user, {message: 'welcome.'});
                    } else {
                        done(null, false, { message: 'Password is not correct.'});
                    }
                });
            } else {
                done(null, false, { message: 'There is no email.'});
            }
    }));
    return passport;
}