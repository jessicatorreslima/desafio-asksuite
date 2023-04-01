require('dotenv').config();

const express = require('express');
const router = require('./src/routes/router.js');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

app.use('/', router);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
