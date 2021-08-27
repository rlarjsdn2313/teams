/*
Inititalize Router
*/
var express = require('express');
var router = express.Router();

// import func to check format of StdntId
var checkStdntId = require('../lib/checkStdntId').checkStdntId;
// import lib to connect to DB
var createConn = require('../lib//mysqlConn');


/*
Login Router
- Request
{
    stdntId: int(ex. 20802),
    passsword: ''
}

- Response
1. no account
2. wrong password
3. yes! and session

- Work Flow
1. check Request
2. check StdntId
3. connect to DB
4. check account
5. get password and compare
*/
router.post('/', (req, res) => {
    /*
    1. check Request
    */
   var neededList = ['stdntId', 'password'];
   var reqKeyList = Object.keys(req.body);

   for (var i=0; i<neededList.length; i++) {
       // needed key is not included in reqKeyList
       if (reqKeyList.indexOf(neededList[i]) == -1) {
           res.send({
               error: true,
               message: 'request format is wrong',
           });

           return;
       }
   }


    /*
    2. check stdntId
    */
    // get all data from req body
    let stdntId = req.body.stdntId;
    let password = req.body.password;

    // filter stdntId
    var errMsg = checkStdntId(String(stdntId));
    if (errMsg.length > 0) {
        res.send({
            error: true,
            message: errMsg,
        });

        return;
    }


    /*
    3. connect to DB
    */
    // create connection to DB
    let connection = createConn.createConnection();
    connection.connect();


    /*
    4. check account
    */
    // query to DB
    connection.query(`SELECT EXISTS (SELECT * FROM user WHERE StudentId=${stdntId}) as success;`, (err, result) => {
        if (err) throw err;
        if (result[0]['success'] != 1) {
            res.send({
                error: true,
                message: 'no account',
            });

            return;
        }

        /*
        5. get password and compare
        */
        // query to DB
        connection.query(`SELECT Password, Session FROM user WHERE StudentId=${stdntId};`, (err, result) => {
            if (err) throw err;
            if (result[0]['Password'] !== password) {
                res.send({
                    error: true,
                    message: 'wrong password',
                });

                return;
            }

            res.send({
                error: false,
                message: 'welcome!',
                sesion: result[0]['Session'],
            });

            return;
        });
    });
});

module.exports = router;
