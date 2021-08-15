// import secret information for create connection to mysql DB
var secret = require('./secret').secret.mysql;
// import mysql lib for connect to DB server
var mysql = require('mysql');


// createConnection is create connection to mysql server
// You have to connect to DB server by connection.connect() function
var createConnection = () => {
    // make mysql connection
    let connection = mysql.createConnection(
        secret
    );

    // return connection to mysql server
    return connection;
}

// export createConnection function to other files
exports.createConnection = createConnection;
