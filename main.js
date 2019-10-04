const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const comperssion = require('compression');
const db = require('./lib/db');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const helmet = require('helmet');

app.use(helmet());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(comperssion());

app.get('*', function(request, response, next){
  db.query(`SELECT * FROM topic`, function(error, topics){
    request.list = topics;
    next();
  });
});

app.use('/', indexRouter);

app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));