var express = require('express');
var router = express.Router();

// import sending mail object
var mail = require('../lib/mail');


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

let createCode = (stdntId) => {
    let code = `${Math.floor(Math.random() * (9999 - 0)) + 0}`.padStart(4, '0');
    
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
    let check = checkStdntId(stdntId);

    if (check.length != 0) {
        res.send({
            error: true,
            message: check
        });
        return;
    }

    let authCode = '213123'

    mail.sendMail(
        mail.generateSchoolEmail(stdntId),
        'JS talk 회원가입 인증 메일',
        `인증 코드 : ${authCode}`,
        `<b>인증 코드 : ${authCode}`,
    );

    res.send({
        error: false,
        message: 'Authorization email sent'
    });

    return;
});

module.exports = router;
