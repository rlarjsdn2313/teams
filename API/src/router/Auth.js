var express = require('express');
var router = express.Router();

// import sending mail object
var mail = require('../lib/mail');

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
            'error': true,
            'message': 'request error'
        });

        // router exit
        return;
    }

    // get stdntId
    let stdntId = req.body.stdntId;

    let authCode = '213123'

    mail.sendMail(
        mail.generateSchoolEmail(stdntId),
        'JS talk 회원가입 인증 메일',
        `인증 코드 : ${authCode}`,
        `<b>인증 코드 : ${authCode}`,
    );

    res.send({
        'error': false,
        'message': 'Authorization email sent'
    });

    return;
});

module.exports = router;
