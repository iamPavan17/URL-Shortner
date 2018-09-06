const express = require('express');
const app = express();
const mongoose = require('./config/db.js');
// const {Url} = require('./models/url.js');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const urlRouter = require('./routes/url-route.js');
var useragent = require('express-useragent');
var morgan = require('morgan');
app.use(morgan('combined'))

const port = 3000;

app.use(bodyParser.json());
app.use(useragent.express());
app.use('/url', urlRouter);

//middlewares
// morgan(':method :url :status :res[content-length] - :response-time ms')

morgan(function (req, res) {
    console.log(req.method);
  });
// app.use((req, res, next) => {
//     console.log(`Started: ${req.method} - ${req.url} for: ${req.ip} at: ${new Date()} `);
//     console.log(morgan(':method :url :status :res[content-length] - :response-time ms'));
//     next();
// });

//routeHandlers
//welcome site
app.get('/', (req, res) => {
    // res.send('Welcome to URL Shortner');
    res.send(req.useragent);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})

