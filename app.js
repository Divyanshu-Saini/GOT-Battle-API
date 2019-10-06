const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();
const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', (error) => console.error(error))
db.once('open',()=>{
    console.log('Database connected!');
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

module.exports = app;
