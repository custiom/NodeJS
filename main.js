const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const comperssion = require('compression');
const db = require('./lib/db');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const helmet = require('helmet');
const cookie = require('cookie');
var isowner = false;
var cookies = {};

app.use(helmet());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(comperssion());

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

app.use('/login', loginRouter);

app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));