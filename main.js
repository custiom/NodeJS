const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const comperssion = require('compression');
const db = require('./lib/db');

app.use(bodyParser.urlencoded({extended:false}));
app.use(comperssion());
app.get('*', function(request, response, next){
  db.query(`SELECT * FROM topic`, function(error, topics){
    request.list = topics;
    next();
  });
});

// route, routing
app.get('/', (request, response) => topic.home(request, response));

app.get('/page/:pageId', (request, response) => topic.page(request, response));

app.get('/create', (request, response) => topic.create(request, response));

app.post('/create_process', (request, response) => topic.create_process(request, response));

app.get('/update/:topicId', (request, response) => topic.update(request, response));

app.post('/update_process', (request, response) => topic.update_process(request, response));

app.post('/delete_process', (request, response) => topic.delete_process(request, response));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));


/*
var http = require('http');
var topic = require('./lib/topic');
var url = require('url');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
      topic.create(request, response);
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname==='/update'){
      topic.update(request, response);
    } else if(pathname === '/update_process'){
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else if(pathname === '/author'){
      author.home(request, response);
    } else if(pathname === '/author/create_process'){
      author.create_process(request, response);
    } else if(pathname === '/author/update'){
      author.update(request, response);
    } else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);

*/