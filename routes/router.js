const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

//TODO implement endpoint here

module.exports = router;
