const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const lowDB = require('../lib/lowdb');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

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
    });

    router.get('/register', (request, response) => {
        var fmsg = request.flash();
        var feedback ='';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        var title = 'Login';
        var list = template.list(request.list);
        var html = template.html(title, list,
            `   <div style="color:red">${feedback}</div>
                <form action="/auth/register_process" method="post">
                    <p><input type="text" name = "email" placeholder="email" value="egoing7777@gmail.com"></p>
                    <p><input type="password" name = "pwd" placeholder="password" value="1111"></p>
                    <p><input type="password" name = "pwd2" placeholder="password" value="1111"></p>
                    <p><input type="text" name = "displayName" placeholder="display name" value="egoing"></p>
                    <p><input type="submit" value = "register"></p>
                </form>
            `,
            `<a href="/topic/create">create</a>`
        );
        response.send(html);  
    });

    router.post('/register_process', (request, response) => {
        var post = request.body;
        var email = post.email;
        var pwd = post.pwd;
        var pwd2 = post.pwd2;
        var displayName = post.displayName;
        var userInfo = lowDB.get('users').find({email:email}).value();

        if(post.email === "" || post.pwd === "" || post.pwd2 === "" || post.displayName === ""){
            request.flash('error', 'everything must be occupied');
            response.redirect(302, `/auth/register`);
        } else if(pwd !== pwd2){
            request.flash('error', 'Password must same!');
            response.redirect(302, `/auth/register`);
        } else if(userInfo !== undefined && userInfo.email === email){
            request.flash('error', 'already exist email');
            response.redirect(302, `/auth/register`);
        } else {
            bcrypt.hash(pwd, 10, (err, hash) => {
                var user = {
                    id:shortid.generate(),
                    email:email,
                    password:hash,
                    displayName:displayName
                }
                lowDB.get('users').push(user).write();
                request.login(user, (err) => {
                    return response.redirect(302, `/`);
                });
            });
        }
        
    });


    router.get('/logout', (request, response)=>{
        request.logout();
        request.session.save(function(){
            response.redirect(302, '/');
        });
    });
    return router;
}