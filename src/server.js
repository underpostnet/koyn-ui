
const express = require('express');
const morganMiddleware = require('./morgan');
const logger = require('./logger');
const app = express();
const port = 5500;
app.use(express.json({limit: '20MB'}));
app.use(morganMiddleware);
const views = require('./views')(app);
const keys = require('./keys')(app);
const tests = require('./tests')({
    views, keys
});
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
