var mysql = require('mysql');

var db = mysql.createConnection({
    host     : require('../password/password').host,
    user     : require('../password/password').user,
    password : require('../password/password').pwd,
    database : require('../password/password').db
  });
db.connect();

module.exports = db;