require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const config = require('./utils/config');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT = config.PORT, DB_URL = config.DB_URL } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
