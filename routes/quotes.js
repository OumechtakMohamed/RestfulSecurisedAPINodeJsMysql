var jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');
var express = require('express'),
    _       = require('lodash');
var app = module.exports = express.Router();
var bodyParser = require('body-parser');

var jwtCheck = jwt({
  secret: config.secretKey
});
function getPublicQuotesDB(done){
    db.get().query('SELECT * FROM quotes WHERE private=0', function(err, rows) {
        if (err) throw err;
        done(rows);
    });
}
function getPrivateQuotesDB(done){
    db.get().query('SELECT * FROM quotes WHERE private=1', function(err, rows) {
        if (err) throw err;
        done(rows);
    });
}


app.get('/api/public/quote', function(req, res) {
  getPublicQuotesDB(function(result) {
	  
	  res.status(200).send(result);
  });
});
app.use('/api/private', jwtCheck);
app.use(bodyParser.json());
app.get('/api/private/quote', function(req, res) {
  getPrivateQuotesDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/private/quote/:id', function (req, res) {
   console.log(req.params.id);
   db.get().query('select * from quotes where private=1 and id=?', [req.params.id], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

app.delete('/api/private/quote/:id', function (req, res) {
   console.log(req.params.id);
   db.get().query('DELETE FROM quotes WHERE private=1 and id=?', [req.params.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});


app.post('/api/public/quote', function (req, res) {
   var postData  = req.body;
   db.get().query('INSERT INTO quotes SET ?', postData, function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});


//rest api to update record into mysql database
app.put('/api/private/quote', function (req, res) {
   db.get().query('UPDATE quotes SET `content`=?,`private`=? where `id`=?', [req.body.content, req.body.private, req.body.id], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});