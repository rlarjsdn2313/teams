var express = require('express');
var router = express.Router();

// import sending mail object
var mail = require('../lib/mail');
// import lib for connect to mysql DB server
var createConn = require('../lib/mysqlConn');


// checkStdntId
var checkStdntId = (stdntId) => {
    // check stdntId lenth
    if (stdntId.length !== 5) {
        return 'too long';
    }


    // check string
    let numbers = '1234567890';

    var i = 0;
    while (i < stdntId.length) {
        if (!numbers.includes(stdntId[i])) {
            return 'format type error';
        }
        i++;
    }

    let grade = stdntId[0];
    if (!'123'.includes(grade)) {
        return 'grade error';
    }

    let cl = stdntId[2];
    if (!'123456789'.includes(cl)) {
        return 'class error';
    }

    let num = parseInt(`${stdntId[3]}${stdntId[4]}`);
    if (!(1 <= num <= 35)) {
        return 'num error';
    }

    return '';
}

/*
{
    stdntId: 학번
}
*/
router.post('/', (req, res) => {

    let reqKeyList = Object.keys(req.body);

    // check stdntId in reqKeyList
    if (!reqKeyList.includes('stdntId')) {
        res.send({
            error: true,
            message: 'request error'
        });

        // router exit
        return;
    }

    // get stdntId
    let stdntId = req.body.stdntId;
    let check = checkStdntId(String(stdntId));

    if (check.length != 0) {
        res.send({
            error: true,
            message: check
        });
        return;
    }

    // if stdntId already in user DB send ERROR
    // create connection
    let connection = createConn.createConnection();
    connection.connect();

    connection.query(`SELECT count(*) FROM user where StudentId = ${stdntId} ;`, (err, result, _) => {
        if (err) throw err;
        // count how many stdntId in user DB
        if (result[0]['count(*)'] >= 1) {
            // send error message
            res.send({
                error: true,
                message: 'this stdunt ID is already in user DB',
            });
            // quit router
            return;
        }

        /*
        Creating Verification Code Part
        1. Create verification in random
        2. Send the code to MYSQL DB
        */
       
        // Create verification code in random
        let code = parseInt(`${Math.floor(Math.random() * (9999 - 0)) + 0}`.padStart(4, '0'));

        // Send the verification code to DB
        connection.query(`INSERT INTO auth_code VALUES (${stdntId}, ${code})`, (err) => {
            if (err) throw err;

            // Send mail
            mail.sendMail(
                mail.generateSchoolEmail(stdntId),
                'JS talk 회원가입 인증 메일',
                `인증 코드 : ${code}`,
                `<b>인증 코드 : ${code}`,
            );
        
            res.send({
                error: false,
                message: 'Authorization email sent'
            });
        
            return;
        });
    });
});

module.exports = router;
