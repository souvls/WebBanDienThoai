// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: process.env.nameDB,
});
  
//check connection
connection.connect((err)=>{
    if(err){
        console.log("=> Error! connecting to MySQL database = ",err);
    }else{
        console.log("=> MySql successfully connectes.");
    }
})
module.exports = connection;