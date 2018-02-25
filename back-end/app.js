require('dotenv').config();
var express = require('express');
var cors = require('cors');
var multer = require('multer');
var serveIndex = require('serve-index');
var PouchDB = require('pouchdb');
var expressPouchDB = require('express-pouchdb');

var app = express();
var uploadPath = 'uploads';
var databasePath = 'database';

app.use(cors());

app.use('/' + databasePath, expressPouchDB(PouchDB));

app.get('/', function(req, res){
  res.send(
    '<h1>React Digital Signage Player Back-end</h1>'
    + '<p>'
    + '  Uploaded files can be found at: '
    + '  <a href="/' + uploadPath + '"><code>/' + uploadPath + '</code></a>'
    + '</p>'
    + '<p>'
    + '  PouchDB can be found at: '
    + '  <a href="/' + databasePath + '"><code>/' + databasePath + '</code></a>'
    + '</p>'
  );
});

var storage = multer.diskStorage({
  destination: './' + uploadPath,
  filename: function(req, file, cb) {
    return cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

app.post('/' + uploadPath, upload.single('file'), function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  return res.status(204).end();
});
app.use('/' + uploadPath, express.static(uploadPath));
app.use('/' + uploadPath, serveIndex(__dirname + '/' + uploadPath));

var port = process.env.PORT;

app.listen(port, console.log(
  'react-digital-signage-player-back-end is now running.' + '\n\n'
  + '  Local:            http://localhost:' + port + '/' + '\n'
));