/* 
Initialize Router
*/
var express = require('express');
var router = express.Router();

// Import lib for crypto
var crypto = require('crypto');
// Import function for filter studentId
var checkStdntId = require('../lib/checkStdntId').checkStdntId;
// Import lib for connect to DB
var createConn = require('../lib/mysqlConn');

// It returns date for hash
var getDate = () => {
    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let day = today.getDay();

    return `${year}${month}${day}`;
}

/*
Create Account Router
- Request
{
    stdntId: int(ex. 20802),
    authCode: int(ex. 1125),
    userName: char(20bit),
    password: char(20bit)
}

- Response
1. Error of request params
2. Wrong authCode
3. Too big or Too short userName, password
4. Success!

- Steps
1. Check request params
2. Filter each params
= stdntId(move function in createAuthCode.js into lib/checkStdntId)
= authCode(4 0000)
= userName(not null and shorter than 20bit)
= password(not null and shorter than 20bit)
3. Connect to DB and check stdntId and authCode
(SELECT Code FROM auth_code WHERE StudentId={studntId};) = RealAuthCode
4. Connect to user table and create account
(INSERT INTO user VALUES ({stdntId}, {userName}, {password}, 'basic', '', ''))
*/
router.post('/', (req, res) => {
    /*
    1. Check Request Params
    */
    // set for needed keys
    var neededKeyList = ['stdntId', 'authCode', 'userName', 'password'];
    // get request key list
    var reqKeyList = Object.keys(req.body);

    for (var i=0; i<4; i++) {
        var check = true;

        for (var a=0; a<reqKeyList.length; a++) {
            if (reqKeyList[a] == neededKeyList[i]) {
                check = false;
                break;
            }
        }
        if (check) {
            res.send({
                error: true,
                message: 'request error'
            });
            return;
        }
    }


    /*
    2. Filter each params
    */
    // stdntId
    // get stdntId
    var stdntId = req.body.stdntId;
    // filter stdntId
    var errMsg = checkStdntId(String(stdntId));
    if (errMsg.length > 0) {
        res.send({
            error: true,
            message: errMsg
        });
        return;
    }

    // authCode
    // get authCode
    var authCode = req.body.authCode;
    if (typeof(authCode) != 'number') {
        res.send({
            error: true,
            message: 'authCode must be number'
        });
        return;
    }

    // check auth code is N
    if (authCode % 1 != 0) {
        res.send({
            error: true,
            message: 'authCode must be N'
        });
        return;
    }

    // check range of authCode
    if (!(0 <= authCode <= 9999)) {
        res.send({
            error: true,
            message: 'authCode must be 0 <= authCode <= 9999'
        });
        return;
    }

    
    // userName
    // get userName
    var userName = req.body.userName;
    

    // password
    // get password
    var password = req.body.password;


    /*
    3. Connect to DB and check stdntId and authCode
    */
    // create connection to DB
    let connection = createConn.createConnection();
    connection.connect();

    // query to DB
    connection.query(`select EXISTS (select * from user where StudentId=${stdntId} limit 1) as success;`, (err, result, fileds) => {
        if (result[0]['success'] == 1) {
            res.send({
                error: true,
                message: 'account already created'
            });
            return;
        }

        connection.query(`SELECT Code FROM auth_code WHERE StudentId=${stdntId};`, (err, result, fileds) => {
            if (err) throw err;
            let realAuthCode = result[0]['Code'];
    
            // wrong auth code
            if (realAuthCode != authCode) {
                res.send({
                    error: true,
                    message: 'autCode is wrong'
                });
                return;
            }
    
            // delete code in DB
            connection.query(`DELETE FROM auth_code WHERE Code=${realAuthCode}`, (err, result, fileds) => {
                if (err) throw err;
            });
    
    
            /*
            4. Connect to user table and create account
            */
            // create session
            var salt = crypto.randomBytes(128).toString('base64');
            var session = crypto.createHash('sha256').update(password + getDate() + salt).digest('hex');
    
            // add user data
            connection.query(`INSERT INTO user VALUES (${stdntId}, '${userName}', '${password}', 'free', '', '${session}');`, (err, result, fileds) => {
                if (err) throw err;
    
                res.send({
                    error: false,
                    message: 'Your Account Is Created!',
                    session: session,
                });
                return;
            });
        });
    });
    
});


// export router
module.exports = router;
