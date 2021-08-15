/* 
Initialize Router
*/
var express = require('express');
var router = express.Router();

// import function for filter studentId
var checkStdntId = require('../lib/checkStdntId').checkStdntId;
// Import lib for connect to DB
var createConn = require('../lib/mysqlConn');


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

    // check how many reqKey
    if (reqKeyList.length !== neededKeyList) {
        res.send({
            error: true,
            message: 'request error'
        });
        return;
    }

    /*
    2. Filter each params
    */
    // stdntId
    // get stdntId
    var stdntId = req.body.stdntId;
    // filter stdntId
    var errMsg = checkStdntId(stdntId);
    if (errMsg.length > 0) {
        res.send({
            error: true,
            message: check
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
    if (!(authCode % 1 != 0)) {
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
    

});
