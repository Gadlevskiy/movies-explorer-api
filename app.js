const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const { PORT = 3100 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const index = require('./routes/index');
const { centralErrorHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger);
app.use(
  cors({
    origin: 'https://new.imdb.nomoredomains.club',
    // origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.options(
  '*',
  cors({
    origin: 'https://new.imdb.nomoredomains.club',
    // origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/', index);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
