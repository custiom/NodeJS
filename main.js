const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const comperssion = require('compression');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const helmet = require('helmet');
const cookie = require('cookie');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const lowDB = require('./lib/lowdb');
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

app.use(flash());

app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('msg', 'Flash is back!!');
  res.send('flash');
});
 
app.get('/flash-display', function(req, res){
  // Get an array of flash messages by passing the key to req.flash()
  var fmsg = req.flash();
  res.send(fmsg);
});

const passport = require('./lib/passport')(app);
const authRouter = require('./routes/auth')(passport);

app.get('*', function(request, response, next){
  request.list = lowDB.get('topics').value();
  
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

app.use('/', indexRouter);

app.use('/auth', authRouter);

app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send(`sorry can't found that`);
});

app.use((err, req, res, next) => {
  res.status(500).send('something broke');
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));