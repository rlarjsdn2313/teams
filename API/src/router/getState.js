var express = require('express');
var router = express.Router();

var checkStdntId = require('../lib/checkStdntId').checkStdntId;
var createConn = require('../lib/mysqlConn');


// This router needs stdntId and session in Request
router.post('/', (req, res) => {
    let stdntId = req.body.stdntId;
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

    connection.query(`SELECT StatePicture FROM user WHERE StudentId=${stdntId};`, (err, result) => {
        if (err) throw err;

        console.log(result);
    });

    // end connection
    connection.end();
});

module.exports = router;
