const
	dotenv = require('dotenv').load(),
	express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/videoChat',
	PORT = process.env.PORT || 3001,
	router = require('./routes/router.js'),
	cors = require('cors'),
	errorHandler = require('./util/errorHandler')
var socket = require('./util/socket')
const fileUpload = require('express-fileupload');
const http = require('http')
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
mongoose.set('useCreateIndex', true)

//db
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
	console.log(err || `Connected to MongoDB.`)
})
app.use(cors());
app.use(fileUpload());
//static
app.use('/public/', express.static(`${__dirname}/public`))
app.use(express.static(`${__dirname}/client/build`))
app.use(logger('dev'))
app.use(bodyParser.json())

//router
app.use('/api', router)

const server = http.createServer(options, app);
//start server
server.listen(PORT, (err) => {
	console.log(`${__dirname}/public`);
	socket(server);
	console.log(err || `Server running on port ${PORT}.`)
});
