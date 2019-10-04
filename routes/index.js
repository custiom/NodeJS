const express = require('express');
const router = express.Router();
const template = require('../lib/template');

// route, routing
router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/topic/create">create</a>`
    );
    response.send(html);  
});

module.exports = router;