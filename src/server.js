
const express = require('express');
const app = express();
const port = 5500;
require('./views')(app);
console.log(`app listen on port ${port}`);
app.listen(port);
