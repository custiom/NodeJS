const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');

// route, routing
router.get('/', (request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    }

    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<div style="color:blue">${feedback}</div>
         <h2>${title}</h2>${description}`,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response)
    );
    response.send(html);
});

module.exports = router;