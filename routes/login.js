const express = require('express');
const router = express.Router();
const template = require('../lib/template');

// route, routing
router.get('/', (request, response) => {
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `
            <form action="/login/login_process" method="post">
                <p><input type="text" name = "email" placeholder="email"></p>
                <p><input type="password" name = "password" placeholder="password"></p>
                <p><input type="submit"></p>
            </form>
        `,
        `<a href="/topic/create">create</a>`,
        request.authStatusUI
    );
    response.send(html);  
});

router.post('/login_process', (request, response)=>{
    var post = request.body;
    if(post.email === 'egoing777@gmail.com' && post.password === '111111'){
        response.cookie('email', post.email);
        response.cookie('password', post.password);
        response.redirect(302, `/`);
    } else {
        response.end('Who');
    }
    
});

router.get('/logout_process', (request, response)=>{
    response.cookie('email', null, {maxAge:0});
    response.cookie('password', null, {maxAge:0});
    response.redirect(302, `/`);
    
});


module.exports = router;