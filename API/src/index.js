// import web framework lib
const express = require('express');
const app = express();

// import middle-ware for post param
const bodyParser = require('body-parser');
const createAccount = require('./router/Auth');

// listening port
const port = 3000;

app.use(bodyParser())
app.use('/auth', createAccount);


app.get('/', (req, res) => {
    console.log('I get a request!')
    res.send('Here is response');
});


// listening
app.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
});
