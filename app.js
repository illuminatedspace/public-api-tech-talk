//setting up server
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

//html rendering
nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

//logging middleware
app.use(morgan('dev'));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//router
const router = require('./routes');

//serve up static files
app.use(express.static(path.join(__dirname, '/public')));

//send requests to router!
app.use(router);

//start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

//error handling
app.use( (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});
