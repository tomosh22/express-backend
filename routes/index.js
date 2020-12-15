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
      if (err) throw err;
      // if there is no error, you have the result
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.send(result);
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
      if (err) throw err;
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

router.post('/insertAddressQuery/:line1/:line2/:postcode', function(req, res, next) {
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
module.exports = router;
