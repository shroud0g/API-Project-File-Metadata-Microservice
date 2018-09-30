'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var upload = multer()

var app = express();

app.use(cors());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
     res.sendFile(__dirname + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), wrapAsync(async function(req, res) {
  await new Promise(resolve => setTimeout(() => resolve(), 50));
  let file = req.file;
  if (file == undefined) {
    throw new Error('File missing');
  }
  else {
    return res.json({name: file.originalname, type: file.mimetype, size: file.size})
  }
}));

//Error handler
app.use(function handleMulterError(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({message: error.message});
  }
  next(error);
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});


function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}