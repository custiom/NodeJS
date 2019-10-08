const http = require('http');
const cookie = require('cookie');

http.createServer((request, response) => {

    var cookies = {};
    if(request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
        console.log(cookies.yummy_cookie);
    }
    
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            'Secure=secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=path; path=/cookie'
        ]
    });
    response.end('cookie');
}).listen(3001);