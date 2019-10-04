var db = require('../lib/db');
var template = require('../lib/template');
var sanitizeHTML = require('sanitize-html');
const express = require('express');
const router = express.Router();

router.get('/create', (request, response) => {
  db.query(`SELECT * FROM author`, function(error2, authors){
    var title = 'Create';
    var list = template.list(request.list);
    var html = template.html(sanitizeHTML(title), list,
      `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `,
      ``
    );
    response.send(html);
  });        
});

router.post('/create_process', (request, response) => {
  var post = request.body;
  db.query(`
      INSERT INTO topic (title, description, created, author_id)
        VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function(error, result){
        if(error){
          throw error;
        }
        response.redirect(302, `/topic/${result.insertId}`);
      }
  );    
});

router.post('/update_process', (request, response) => {
  var post = request.body;
  db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id = ?`, [post.title, post.description, post.author, post.id], function(error, result){
    response.redirect(302, `/topic/${post.id}`);
  });  
});

router.post('/delete_process', (request, response) => {
  var post = request.body;
  db.query(`DELETE FROM topic WHERE id = ?`, post.id, function(error, result){
    if(error){
      throw error;
    }
    response.redirect(302, `/`);
  });  
});

router.get('/update/:topicId', (request, response) => {
  db.query(`SELECT * FROM topic WHERE id = ?`, [request.params.topicId], function(error2, topic){
    if(error2){
      throw error2;
    }
    db.query(`SELECT * FROM author`, function(error3, authors){
      if(error3){
        throw error3;
      }
      var list = template.list(request.list);
      var html = template.html(sanitizeHTML(topic[0].title), list,
        `<form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
          <p>
            <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
          </p>
          <p>
            ${template.authorSelect(authors, topic[0].author_id)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`,
        `<a href="/create">create</a> <a href="/topic/update/${topic[0].id}">update</a>`
      );
      response.send(html);
      });
    });
});

router.get('/:pageId', (request, response) => {
  db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [request.params.pageId], function(error2, topic){
    if(error2){
      throw error;
    }
    var title = topic[0].title;
    var description = topic[0].description;
    var list = template.list(request.list);
    var html = template.html(title, list,
      `
      <h2>${sanitizeHTML(title)}</h2>
      ${sanitizeHTML(description)}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px">
      <p>by ${sanitizeHTML(topic[0].name)}</p>
      `,
      `<a href="/topic/create">create</a>
        <a href="/topic/update/${request.params.pageId}">update</a>
        <form action = "/topic/delete_process" method ="post">
        <input type ="hidden" name = "id" value="${request.params.pageId}">
        <input type="submit" value = "delete">
        </form>`
    );
    response.send(html);
  });  
});

module.exports = router;