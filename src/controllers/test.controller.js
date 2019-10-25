const express = require('express');

const app = express();

app.get('/', (req, res) => res.status(403).send('Sorry but you are unauthorized to visit this page.'));

module.exports = app;