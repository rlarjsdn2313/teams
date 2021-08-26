// import web framework lib
const express = require('express');
const app = express();


// import middle-ware for post param
const bodyParser = require('body-parser');
const createAuthCode = require('./router/createAuthCode');
const createAccount = require('./router/createAccount');
const getState = require('./router/getState');
const changeState = require('./router/changeState');

// listening port
const port = 3000;


app.use(bodyParser())
app.use('/CreateAuthCode', createAuthCode);
app.use('/CreateAccount', createAccount);
app.use('/GetState', getState);
app.use('/ChangeState', changeState);


app.get('/', (req, res) => {
    console.log('I get a request!')
    res.send('Here is response');
});


// listening
app.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
});
