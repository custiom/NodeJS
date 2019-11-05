const express = require('express');
const router = express.Router();
const template = require('../lib/template');


//test email and password
var authData = {
    email:'egoing777@gmail.com',
    password:'111111',
    nickname:'egoing'
}

module.exports = function(passport){
    // route, routing
    router.get('/login', (request, response) => {
        var fmsg = request.flash();
        var feedback ='';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        var title = 'Login';
        var list = template.list(request.list);
        var html = template.html(title, list,
            `   <div style="color:red">${feedback}</div>
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

    router.post('/login_process',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash : true,
        successFlash : true
    }), (req, res, next) => {
        req.session.is_Logined = true;
        req.session.nickname = authData.nickname;
        console.log(err);
    }
    );

    router.get('/logout', (request, response)=>{
        request.logout();
        // request.session.destroy((err) => {
        //     response.redirect(302, `/`);
        // });
        request.session.save(function(){
            response.redirect(302, '/');
        });
    });
    return router;
}