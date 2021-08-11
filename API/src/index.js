// import web framework lib
const express = require('express');
const app = express();

// listening port
const port = 3000;

// listening
app.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
});
