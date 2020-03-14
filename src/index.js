const { port, env } = require('./config/config');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const generateData = require('./generateData');

// open mongoose connection
const db = mongoose.connect();
generateData(db);
// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
