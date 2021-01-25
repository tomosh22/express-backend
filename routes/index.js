var express = require('express');
var router = express.Router();
var { param, validationResult }= require('express-validator');
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
    console.log("hi")
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
  /*
  Reads Username, Salt, FirstName, SecondName and Email from the User Table
  where Username matches username parameter
   */
  p= req.params;
  query = "SELECT Username,Salt,FirstName,SecondName,Email FROM User WHERE Username = "+"\'"+p.username+"\'";
  doGet(query,res);
});

router.get('/selectHashAndSalt/:username', function(req, res, next) {
  /*
  Reads Password and Salt from the User Table
  where Username matches username parameter
   */
  p= req.params;
  query = "SELECT Password,Salt FROM User WHERE Username = "+"\'"+p.username+"\'";
  doGet(query,res);
});

router.post('/insertAddress/:number/:street/:townorcity/:county/:postcode', function(req, res, next) {
  /*
  Creates a new record in the Address Table
   */
  p = req.params;
  query = "INSERT INTO Address (Number,Street,TownOrCity,County,Postcode) " +
      "VALUES("+
      "\'"+p.number+"\',"+
      "\'"+p.street+"\',"+
      "\'"+p.townorcity+"\',"+
      "\'"+p.county+"\',"+
      "\'"+p.postcode+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.get('/selectAddress/:number/:street/:townorcity/:county/:postcode', function(req, res, next) {
  /*
  Reads addressID from the Address Table
  where Number,Street,TownorCity,County,Postcode matches number,street,townorcity,county,postcode parameters
   */
  p = req.params;
  query = "SELECT AddressId FROM Address WHERE Number = "+"\'"+ p.number + "\'"+" AND Street = " + "\'"+p.street + "\'"+" " +
      "AND TownOrCity = "+"\'"+ p.townorcity + "\'"+" AND County = "+"\'"+ p.county + "\'"+" AND Postcode = " + "\'"+ p.postcode +"\'";
  console.log(query);
  doGet(query,res);
});

router.post('/insertUser/:username/:password/:salt/:firstname/:secondname/:email/:addressid', function(req, res, next) {
  /*
  Creates a new record in the User Table
   */
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
  /*
  Reads username from the User Table
  where Username matches username parameter
   */
  p = req.params;
  query = "SELECT Username FROM User WHERE Username = " + "\'" + p.username + "\'";
  console.log(query);
  doGet(query,res);
});

router.get('/getUserAccounts/:username', function(req, res, next) {
  /*
  Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
  where Username matches username parameter
   */
  p = req.params;
  query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'";
  console.log(query);
  doGet(query,res);
});

router.get('/getAccountNames/:username/:accountName', function(req, res, next) {
  /*
  Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
  where Username, Name matches username, accountName parameters
   */
  p = req.params;
  query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'"+ " AND Name = " + "\'" + p.accountName + "\'";
  console.log(query);
  doGet(query,res);
});

router.get('/getAccountNumbers/:accountNumber', function(req, res, next) {
  /*
  Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
  where AccNumber matches accountNumber parameter
   */
  p = req.params;
  query = "SELECT * FROM Account WHERE AccNumber = " + "\'" + p.accountNumber + "\'";
  console.log(query);
  doGet(query,res);
});

router.post('/insertAccount/:accountName/:type/:balance/:currency/:username/:accountNumber', function(req, res, next) {
  /*
  Creates a new record in the Account Table
   */
  p = req.params;
  query = "INSERT INTO Account (Name,Type,Balance,Currency,Username,AccNumber) " +
      "VALUES("+
      "\'"+p.accountName+"\',"+
      "\'"+p.type+"\',"+
      +p.balance+","+
      "\'"+p.currency+"\',"+
      "\'"+p.username+"\',"+
      "\'"+p.accountNumber+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.get('/getUserBalance/:accnumber', function(req, res, next) {
  /*
  Reads Balance and Currency from the Account Table
  where AccNumber matches accnumber parameter
   */
  p = req.params;
  query = "SELECT Balance,Currency FROM Account WHERE AccNumber = " + "\'" + p.accnumber + "\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});

router.get('/getUserTransactions/:username', function(req, res, next) {
  /*
  Reads TransactionId, Amount, DateTime, NameTo, AccNumberTo, AccNumberFrom, Reference and Tag from Transaction Table
  where Username matches username parameter
   */
  p = req.params;
  query = "SELECT * FROM Transaction WHERE EXISTS (SELECT * FROM Account WHERE (Transaction.AccNumberFrom = Account.AccNumber OR Transaction.AccNumberTo = Account.AccNumber) AND Account.Username = " + "\'" + p.username + "\'"+")";
  console.log(query);
  doGet(query,res);
});

router.post('/insertTransaction/:accFrom/:accNumber/:amount/:reference/:tag/:datetime/:accName', function(req, res, next) {
  /*
  Creates a new record in the Transaction Table
   */
  p = req.params;
  query = "INSERT INTO Transaction (Amount,DateTime,NameTo,AccNumberTo,AccNumberFrom,Reference,Tag) " +
      "VALUES("+
      "\'"+p.amount+"\',"+
      "\'"+p.datetime+"\',"+
      "\'"+p.accName+"\',"+
      "\'"+p.accNumber+"\',"+
      "\'"+p.accFrom+"\',"+
      "\'"+p.reference+"\',"+
      "\'"+p.tag+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.post('/insertFutureTransaction/:accFrom/:accNumber/:amount/:reference/:tag/:datetime/:accName', function(req, res, next) {
  /*
  Creates a new record in the FutureTransaction Table
   */
  p = req.params;
  query = "INSERT INTO FutureTransaction (Amount,DateTime,NameTo,AccNumberTo,AccNumberFrom,Reference,Tag) " +
      "VALUES("+
      "\'"+p.amount+"\',"+
      "\'"+p.datetime+"\',"+
      "\'"+p.accName+"\',"+
      "\'"+p.accNumber+"\',"+
      "\'"+p.accFrom+"\',"+
      "\'"+p.reference+"\',"+
      "\'"+p.tag+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.post('/setFavouritePayees/:username/:accName/:accNumber', function(req, res, next){
  /*
  Creates a new record in the Favourites Table
   */
  p = req.params;
  query = "INSERT INTO Favourites (Username,Name,AccNumber) " +
      "VALUES("+
      "\'"+p.username+"\',"+
      "\'"+p.accName+"\',"+
      "\'"+p.accNumber+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.get('/getFavouritePayees/:username', function(req, res, next) {
  /*
  Reads Name and AccNumber from Favourites Table
  where Username matches username parameter
   */
  p = req.params;
  query = "SELECT Name,AccNumber FROM Favourites WHERE Username = " + "\'" + p.username + "\'";
  console.log(query);
  doGet(query,res);
});

router.get('/getAccountPayees/:accFrom', function(req, res, next) {
  /*
  Reads AccNumberTo and NameTo from Transaction Table
  where AccNumberFrom matches accFrom parameter
   */
  p = req.params;
  query = "SELECT AccNumberTo, NameTo FROM Transaction WHERE AccNumberFrom = " + "\'" + p.accFrom + "\'";
  console.log(query);
  doGet(query,res);
});

router.post('/updateAccountBalance/:accNumber/:amount', function(req, res, next) {
  /*
  Updates Balance in Account by amount parameter
  where AccNumber matches accNumber parameter
   */
  p = req.params;
  query = "UPDATE Account SET Balance = Balance + " + "\'" + p.amount + "\'" + " WHERE AccNumber = " + "\'" + p.accNumber + "\'";
  console.log(query);
  doPost(query,res);
});

router.post('/setTag/:username/:tagName', function(req, res, next){
  /*
  Creates a new record in the Tags Table
   */
  p = req.params;
  query = "INSERT INTO Tags (Username,Tag) " +
      "VALUES("+
      "\'"+p.username+"\',"+
      "\'"+p.tagName+"\'"+
      ");";
  console.log(query);
  doPost(query,res);
});

router.get('/getTag/:username',
    //param(['username',"Invalid Username"]).notEmpty(),
    function(req, res, next) {
    //const errors=validationResult(req);
    //if (!errors.isEmpty()){
      //console.log(errors)
    //}else {
      /*
      Reads Tag from Tags Table
      where Username matches username parameter
       */
      p = req.params;
      query = "SELECT Tag FROM Tags WHERE Username = " + "\'" + p.username + "\'";
      console.log(query);
      doGet(query, res);
    //}
});

router.post('/deleteTag/:username/:tagName',
    //param(['username',"Invalid username"]).notEmpty(),
    function(req, res, next){
    //const errors=validationResult(req);
    //if (!errors.isEmpty()){
      //console.log(errors)
    //}else {
      /*
      Deletes a record from Tags Table
      where Username,Tag matches username,tagName parameter
       */
      p = req.params;
      query = "DELETE FROM Tags WHERE Username = " + "\'" + p.username + "\'" + " AND Tag = " + "\'" + p.tagName + "\'";
      console.log(query);
      doPost(query, res);
    //}
});

module.exports = router;