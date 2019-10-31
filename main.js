const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const comperssion = require('compression');
const db = require('./lib/db');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const helmet = require('helmet');
const cookie = require('cookie');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var isowner = false;
var cookies = {};

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(comperssion());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store : new FileStore()
}));


//test email and password
var authData = {
  email:'egoing777@gmail.com',
  password:'111111',
  nickname:'egoing'
}

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('Serialize user called.', user);
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  console.log('Deserialize user called.', id);
  done(null, authData);
});

passport.use(new LocalStrategy(
{
  usernameField : 'email',
  passwordField : 'pwd'
},
(username, password, done) => {
  console.log('LocalStrategy', username, password);
  if(username === authData.email){
    console.log(1);
    if(password === authData.password){
      console.log(2);
      done(null, authData);
    } else {
      console.log(3);
      done(null, false, { message: 'Incorrect password.' });
    }
  } else {
    console.log(4);
    done(null, false, { message: 'Incorrect username.' });
  }
}));

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login' 
  }), (req, res, next) => {
      req.session.is_Logined = true;
      req.session.nickname = authData.nickname;
      console.log(err);
  }
);

app.get('*', function(request, response, next){
  db.query(`SELECT * FROM topic`, function(error, topics){
    request.list = topics;
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
        if(cookies.email === 'egoing777@gmail.com' && cookies.password === '111111'){
          isowner = true;
          request.isOwner = true;
          request.authStatusUI = '<a href="/login/logout_process">logout</a>';
        }
    } else {
      isowner = false
      request.isOwner = false;
      request.authStatusUI = '<a href="/login">login</a>';
    }
    next();
  });
});

app.use('/', indexRouter);

app.use('/auth', authRouter);

app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  res.status(500).send('something broke');
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));