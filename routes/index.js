var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var config = {
  user:"user",
  password:"password",
  host:"localhost",
  port:33333,
  database:"stubank",
  //schema:"stubank",
  insecureAuth : true
}
function doGet(sql,res)
{
  var con = mysql.createConnection(config);
  con.connect(function(err) {
    if (err) throw err;
    // if connection is successful
    con.query(sql,function (err, result, fields) {
      // if any error while executing above query, throw error
      if (err){ res.status(500); throw (err)};
      // if there is no error, you have the result
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.send(result);
      res.end();
    });
  });
}
function doPost(sql,res)
{
  var con = mysql.createConnection(config);
  con.connect(function(err) {
    if (err) throw err;
    // if connection is successful
    con.query(sql,function (err, result, fields) {
      // if any error while executing above query, throw error
      if (err){ res.status(500); throw (err)};
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.status(200)
      res.send(null)
    });
  });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/selectLoginUser/:username', function(req, res, next) {
  query = "SELECT Username,FirstName,SecondName,Email FROM User WHERE Username = "+"\'"+req.params.username+"\'";
  doGet(query,res);
});

router.post('/insertAddress/:line1/:line2/:postcode', function(req, res, next) {
  p = req.params;
  query = "INSERT INTO Address (Line1,Line2,Postcode) " +
      "VALUES("+
      "\'"+p.line1+"\',"+
      "\'"+p.line2+"\',"+
      "\'"+p.postcode+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.get('/selectAddress/:line1/:line2/:postcode', function(req, res, next) {
  p = req.params;
  query = "SELECT AddressId FROM Address WHERE Line1 = "+"\'"+ p.line1 + "\'"+" AND Line2 = " + "\'"+p.line2 + "\'"+" AND Postcode = " + "\'"+ p.postcode +"\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});

router.post('/insertUser/:username/:password/:salt/:firstname/:secondname/:email/:addressid', function(req, res, next) {
  p = req.params;
  query = "INSERT INTO User (Username,Password,Salt,Firstname,SecondName,Email,AddressId) " +
      "VALUES("+
      "\'"+p.username+"\',"+
      "\'"+p.password+"\',"+
      "\'"+p.salt+"\',"+
      "\'"+p.firstname+"\',"+
      "\'"+p.secondname+"\',"+
      "\'"+p.email+"\',"+
      +p.addressid+
      ");";
  console.log(query);
  doPost(query,res);
});
router.get('/selectUsername/:username', function(req, res, next) {
  p = req.params;
  query = "SELECT Username FROM User WHERE Username = " + "\'" + p.username + "\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});
router.get('/getUserAccounts/:username', function(req, res, next) {
  p = req.params;
  query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});
router.get('/getUserBalance/:username/:accnumber', function(req, res, next) {
  p = req.params;
  query = "SELECT Balance FROM Account WHERE Username = " + "\'" + p.username + "\'" + " AND AccNumber = " + "\'" + p.accnumber + "\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});
router.post('/insertTransaction/:accFrom/:accTo/:currency/:amount/:datetime', function(req, res, next) {
  p = req.params;
  query = "INSERT INTO Transaction (Amount,DateTime,AccNumberTo,AccNumberFrom,Currency) " +
      "VALUES("+
      "\'"+p.amount+"\',"+
      "\'"+p.datetime+"\',"+
      "\'"+p.accTo+"\'"+
      "\'"+p.accFrom+"\'"+
      "\'"+p.currency+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});
module.exports = router;
