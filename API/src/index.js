// import web framework lib
const express = require('express');
const app = express();

// listening port
const port = 3000;


app.get('/', (req, res) => {
    console.log('I get a request!')
    res.send('Here is response');
});


// listening
app.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
});
