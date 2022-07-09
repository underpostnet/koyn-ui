
const express = require('express');
const app = express();
const port = 5500;
const views = require('./views')(app);
const keys = require('./keys')(app);
// const tests = require('./tests')({
//     views, keys
// });
console.log(`app listen on port ${port}`);
app.listen(port);
