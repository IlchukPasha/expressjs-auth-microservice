require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const swaggerSpec = require('./routes/swagger');
const errorHandler = require('./core/errorHandler');
const routeNotFoundHandler = require('./core/routeNotFoundHandler');

require('./core/db');

const app = express();
app.use(bodyParser.json());

routes(app);

if (['development', 'testing'].includes(process.env.NODE_ENV)) {
  app.use(swaggerSpec);
}

routeNotFoundHandler(app);
errorHandler(app);

app.listen(process.env.PORT, () => {
  /* eslint-disable-next-line */
  console.log(`App is listening on port ${process.env.PORT}`);
});
