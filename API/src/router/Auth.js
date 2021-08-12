var express = require('express');
var router = express.Router();

/*
{
    stdntId: 학번
}
*/
router.post('/', (req, res) => {
    let reqKeyList = Object.keys(req.body);
    console.log(reqKeyList);
});

module.exports = router;
