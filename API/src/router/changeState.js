/*
Initialize Router
*/
var express = require('express');
var router = express.Router();

// import func to check format of StdntId
var checkStdntId = require('../lib/checkStdntId').checkStdntId;
// import lib to connect to DB
var createConn = require('../lib/mysqlConn');


/*
Change State Router
- Request
{
    session: text,
    stdntId: int(ex. 20802),
    state: '',
}

- Response
1. session is wrong
2. right state code

- Work Flow
1. check Request
2. check stdntId, state format
3. connect to DB
4. check session is right
5. change state
*/
router.post('/', (req, res) => {
    /*
    1. check Request
    */
    var neededList = ['stdntId', 'session', 'state'];
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
    2. check stdntId, state format
    */
    // get stdntId, session, state from Request
    let stdntId = req.body.stdntId;
    let session = req.body.session;
    let state = req.body.state;

    // filter state
    if (state != 'busy' && state != 'free') {
        res.send({
            error: true,
            message: 'state error',
        });

        return;
    }

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
    4. check session is right
    */
    // query to DB
    connection.query(`SELECT StudentId FROM user WHERE Session='${session}';`, (err, result) => {
        // check error
        if (err) throw err;

        // no session
        if (result.length < 1) {
            res.send({
                error: true,
                message: 'no session',
            });

            return;
        }

        // wrong session
        if (result[0]['StudentId'] != stdntId) {
            res.send({
                error: true,
                message: 'session is wrong',
            });

            return;
        }


        /*
        5. chagne state
        */
        // query to DB
        connection.query(`UPDATE user SET StatePicture='${state}' WHERE StudentId=${stdntId};`, (err, result) => {
            // check error
            if (err) throw err;

            res.send({
                error: false,
                message: 'we changed it!',
            });

            return;
        });
    });
});


// export router
module.exports = router;
