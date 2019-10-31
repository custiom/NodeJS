const express = require('express');
const router = express.Router();
const template = require('../lib/template');


//test email and password
var authData = {
    email:'egoing777@gmail.com',
    password:'111111',
    nickname:'egoing'
}

// route, routing
router.get('/login', (request, response) => {
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `
            <form action="/auth/login_process" method="post">
                <p><input type="text" name = "email" placeholder="email"></p>
                <p><input type="password" name = "pwd" placeholder="password"></p>
                <p><input type="submit" value = "login"></p>
            </form>
        `,
        `<a href="/topic/create">create</a>`
    );
    response.send(html);  
});

router.get('/logout', (request, response)=>{
    request.session.destroy((err) => {
        response.redirect(302, `/`);
    });
});


module.exports = router;