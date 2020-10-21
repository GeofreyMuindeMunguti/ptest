const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({limit: '20mb', extended: true});
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO.listen(server);
const jwtRouteAuth = require('./helper/jwtAuthentication.js');
const Emit = require('./api/emit/emit.controller.js');
const fileUpload = require('express-fileupload');
const config = require('./config');
const routes = require('./router');
const env = require('dotenv').config();
//var morgan = require('morgan');
//var morganext = require('mongo-morgan-ext');
const mongoose = require('mongoose');
const consul_client = require('./consul_client.js');
app.use(express.urlencoded({extended: false}));


//cors
app.use(cors());
app.use(fileUpload());
// Bordy parser
app.use(bodyParser.json({limit: '20mb'}));
app.use(urlencodedParser);

// Authenticate Requests to the api
// app.use(jwtRouteAuth());

const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
      console.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
      setTimeout(()=>{
        Emit(app, io);
      }, 1)
  });
// minor change
  next()
};

app.use(logRequestStart);

// Connecting to database
mongoose.connect(config.mongo.url, {useNewUrlParser: true, useCreateIndex: true}).then(r =>{
  console.log('Database Connected...');
}).catch(r =>{ console.log('Database Not Connected!!')});



//Socket Connection
io.on('connection', function(){});

routes.register(app);


// Listening to port
server.listen(process.env.PORT, () => {
  console.log('Server running on localhost:'+process.env.PORT);
});

module.exports = app;
