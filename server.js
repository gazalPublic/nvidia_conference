var https = require('https');
var fs = require('fs');
var JSONDATA = require('./step2');
var express = require('express');
var app = express();

var options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  ca: fs.readFileSync('./ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};
//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/data', JSONDATA.getData,function (req, res) {
	//res.send('hello world!!');
  res.send(req.bodyResult);
});

app.get('/speakerData',JSONDATA.getRefinedData,function(req,res,next){
    req.bodyResult = req.names;
    next();
},JSONDATA.speakerDisplay,function(req,res,next){
   
    res.send(req.speakerMe);
});
app.get('/speaker',JSONDATA.getData,function(req,res,next){
    req.rawData = req.bodyResult;
    next();
},JSONDATA.getRefinedData,function(req,res,next){
    req.speakerResult = req.names;
    next();
},JSONDATA.speakerDisplay,function(req,res,next){
   
    res.send(req.speakerMe);
});

app.get('/organization',JSONDATA.getRefinedData,function(req,res,next){
    req.bodyResult = req.ALLSpeakersgiven;
    next();
}, JSONDATA.organizationInfo,function(req,res,next){
    res.send(req.orgData);
});
app.use(express.static('node_modules'));
app.use(express.static('public'));


var httpsServer = https.createServer(options,app); 
httpsServer.listen(8443);