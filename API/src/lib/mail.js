// lib for sending gmail
var nodemailer = require('nodemailer');
var secret = require('./secret').secret;


var sendMail = async (email, title, content, htmlContent) => {
    // set sending email option
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // gmail address
            user: secret.email.address,
            pass: secret.email.password,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Teams 개발자" <${email.address}>`,
        to: email,
        subject: title,
        text: content,
        html: htmlContent,
    });
    
    console.log(`Message send: ${info.messageId}`);

    return true;
}

exports.sendMail = sendMail;
