require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const errorHandler = require('./core/errorHandler');
const routeNotFoundHandler = require('./core/routeNotFoundHandler');

const app = express();
app.use(bodyParser.json());

routes(app);
routeNotFoundHandler(app);
errorHandler(app);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});