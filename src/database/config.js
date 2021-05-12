const auth = require("../../secret/auth.js");

module.exports = {
    "username": auth.mysql_user,
    "password": auth.mysql_password,
    "database": auth.mysql_database,
    "host": auth.mysql_host,
    "dialect": "mysql"
}