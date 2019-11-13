const db = require('../lib/db');
const template = require('../lib/template');
const sanitizeHTML = require('sanitize-html');
const express = require('express');
const auth = require('../lib/auth');
const router = express.Router();
const lowDB = require('../lib/lowdb');
const shortid = require('shortid');

router.get('/create', (request, response) => {
  
  if(!auth.isOwner(request, response)){
    request.flash('msg', 'please login your account');
    response.redirect(302, '/');
    return false;
  }

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
          <input type="submit" value="submit">
        </p>
      </form>
    `,
    ``,
    auth.statusUI(request, response)
  );
  response.send(html);
});

router.post('/create_process', (request, response) => {
  if(!auth.isOwner(request, response)){
    response.redirect(302, '/');
    return false;
  }
  
  var id = shortid.generate();
  var post = request.body;
  var title = post.title;
  var description = post.description;
  var user_id = request.user.id;
  
  lowDB.get('topics').push({
      id:id,
      title:title,
      description:description,
      user_id:user_id
  }).write();
  response.redirect(302, `/topic/${id}`);
});

router.post('/update_process', (request, response) => {
  
  if(!auth.isOwner(request, response)){
    response.redirect(302, '/');
    return false;
  }
  
  var post = request.body;
  
  var topic = lowDB.get('topics').find({id:post.id}).value();
  
  if(topic.user_id !== request.user.id){
    request.flash('msg', 'this topic is not mine');
    response.redirect(302, `/topic/${post.id}`);
    return;
  }
  
  lowDB.get('topics').find({id:post.id}).assign({title:post.title, description:post.description}).write();
  
  response.redirect(302, `/topic/${post.id}`);
});

router.post('/delete_process', (request, response) => {
  
  if(!auth.isOwner(request, response)){
    response.redirect(302, '/');
    return false;
  }
  
  var post = request.body;
  var topic = lowDB.get('topics').find({id:post.id}).value();
  
  if(topic.user_id !== request.user.id){
    request.flash('msg', 'this topic is not mine');
    response.redirect(302, `/topic/${post.id}`);
    return false;
  }
  
  lowDB.get('topics').remove({id:post.id}).write();
  response.redirect(302, `/`);
  
});

router.get('/update/:topicId', (request, response) => {
  var topic = lowDB.get('topics').find({id:request.params.topicId}).value();

  if(topic.user_id !== request.user.id){
    request.flash('msg', 'this topic is not mine');
    response.redirect(302, `/topic/${topic.id}`);
    return;
  }
    
  var list = template.list(request.list);
  var html = template.html(sanitizeHTML(topic.title), list,
    `<form action="/topic/update_process" method="post">
      <input type="hidden" name="id" value="${topic.id}">
      <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic.title)}"></p>
      <p>
        <textarea name="description" placeholder="description">${sanitizeHTML(topic.description)}</textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>`,
    `<a href="/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
    auth.statusUI(request, response)
  );
  
  response.send(html);
});

router.get('/:pageId', (request, response) => {
  var topic = lowDB.get('topics').find({id:request.params.pageId}).value();
  
  var user = lowDB.get('users').find({id:topic.user_id}).value();
  var fmsg = request.flash();
  var feedback ='';
  if(fmsg.msg){
    feedback = fmsg.msg[0];
  }
  var title = topic.title;
  var description = topic.description;
  var list = template.list(request.list);
  var html = template.html(title, list,
    `
    <div style="color:red">${feedback}</div>
    <h2>${sanitizeHTML(title)}</h2>
    ${sanitizeHTML(description)}
    <p>by ${user.displayName}<p>
    `,
    `<a href="/topic/create">create</a>
      <a href="/topic/update/${topic.id}">update</a>
      <form action = "/topic/delete_process" method ="post">
      <input type ="hidden" name = "id" value="${topic.id}">
      <input type="submit" value = "delete">
      </form>`,
    auth.statusUI(request, response)
  );
  response.send(html);
  
});

module.exports = router;