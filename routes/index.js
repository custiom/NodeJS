const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');

// route, routing
router.get('/', (request, response) => {
    var fmsg = request.flash();
    var feedbackSuccess = '';
    var feedbackMsg = '';
    if(fmsg.success){
        feedbackSuccess = fmsg.success[0];
    }
    if(fmsg.msg){
        feedbackMsg = fmsg.msg[0];
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<div style="color:blue">${feedbackSuccess}</div>
         <div style="color:red">${feedbackMsg}</div>
         <h2>${title}</h2>${description}`,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response)
    );
    response.send(html);
});

module.exports = router;