const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const lowDB = low(adapter)
lowDB.defaults({users:[], topics:[]}).write();

module.exports = lowDB;