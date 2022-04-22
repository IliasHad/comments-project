require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST
  }
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
io.on('connection', () => {
  console.log('Socket Connected');
});

app.use((req, res, next) => {
  res.io = io;
  next();
});
app.use('/api/v1', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = server;
