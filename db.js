let mysql = require("mysql");

let connection = mysql.createPool({
user: process.env.DB_User,
password: process.env.DB_Password, 
host: process.env.DB_Host, 
port:process.env.DB_Port 
});
