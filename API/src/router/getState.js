var express = require('express');
var router = express.Router();

var checkStdntId = require('../lib/checkStdntId').checkStdntId;
var createConn = require('../lib/mysqlConn');


// This router needs stdntId and session in Request
router.post('/', (req, res) => {
    let stdntId = req.body.stdntId;
    let session = req.body.session;
    var check = checkStdntId(String(stdntId));

    if (check.length != 0) {
        res.send({
            error: true,
            message: check,
        });
        return;
    }


    let connection = createConn.createConnection();
    connection.connect();

    // check user with session
    connection.query(`SELECT EXISTS (SELECT * FROM user WHERE Session='${session}') as success;`, (err, result) => {
        if (err) throw err;
        if (result[0]['success'] != 1) {
            res.send({
                error: true,
                message: 'session is not right'
            });

            return;
        }

        // get state and send
        connection.query(`SELECT StatePicture FROM user WHERE StudentId=${stdntId};`, (err, result) => {
            if (err) throw err;
            
            let status = result[0]['StatePicture'];

            res.send({
                error: false,
                message: 'we get state!',
                state: status,
            });

            return;
        });
    });
});

module.exports = router;
