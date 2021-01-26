var express = require('express');
var router = express.Router();
var { param, validationResult }= require('express-validator');
var nodemailer = require('nodemailer');
var cors = require('cors');
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
var transport = {
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: "stuteam15@outlook.com",
    pass: "ak7xI8l9@&AG"
  }
}
var transporter = nodemailer.createTransport(transport)
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

  var mail = {
    from: name,
    to: 'stuteam15@outlook.com',
    subject: 'New Message from StuBank Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
    }
  })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3005)

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




router.get('/selectLoginUser/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads Username, Salt, FirstName, SecondName and Email from the User Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT Username,Salt,FirstName,SecondName,Email FROM User WHERE Username = " + "\'" + p.username + "\'";
      doGet(query, res);
    }
});

router.get('/selectHashAndSaltAndSecret/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads Password and Salt from the User Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT Password,Salt,Secret FROM User WHERE Username = " + "\'" + p.username + "\'";
      doGet(query, res);
    }
});

router.post('/insertAddress/:number/:street/:townorcity/:county/:postcode',[
    param('number').notEmpty(),
    param('street').notEmpty(),
    param('townorcity').notEmpty(),
    param('county').notEmpty(),
    param('postcode').matches("^[A-Z]{1,2}[0-9]{1,2}[A-Z]?(\\s*[0-9][A-Z]{1,2})?$")],
    function(req, res, next) {
    /*
    Creates a new record in the Address Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO Address (Number,Street,TownOrCity,County,Postcode) " +
          "VALUES(" +
          "\'" + p.number + "\'," +
          "\'" + p.street + "\'," +
          "\'" + p.townorcity + "\'," +
          "\'" + p.county + "\'," +
          "\'" + p.postcode + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.get('/selectAddress/:number/:street/:townorcity/:county/:postcode',[
    param('number').notEmpty(),
    param('street').notEmpty(),
    param('townorcity').notEmpty(),
    param('county').notEmpty(),
    param('postcode').matches("^[A-Z]{1,2}[0-9]{1,2}[A-Z]?(\\s*[0-9][A-Z]{1,2})?$")],
    function(req, res, next) {
    /*
    Reads addressID from the Address Table
    where Number,Street,TownorCity,County,Postcode matches number,street,townorcity,county,postcode parameters
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT AddressId FROM Address WHERE Number = " + "\'" + p.number + "\'" + " AND Street = " + "\'" + p.street + "\'" + " " +
          "AND TownOrCity = " + "\'" + p.townorcity + "\'" + " AND County = " + "\'" + p.county + "\'" + " AND Postcode = " + "\'" + p.postcode + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.post('/insertUser/:username/:password/:salt/:firstname/:secondname/:email/:addressid',[
    param('username').notEmpty(),
    param('password').notEmpty(),
    param('salt').notEmpty(),
    param('firstname').notEmpty(),
    param('secondname').notEmpty(),
    param('email').matches("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"),
    param('addressid').matches("^[0-9]+$")],
    function(req, res, next) {
    /*
    Creates a new record in the User Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO User (Username,Password,Salt,Firstname,SecondName,Email,AddressId) " +
          "VALUES(" +
          "\'" + p.username + "\'," +
          "\'" + p.password + "\'," +
          "\'" + p.salt + "\'," +
          "\'" + p.firstname + "\'," +
          "\'" + p.secondname + "\'," +
          "\'" + p.email + "\'," +
          +p.addressid +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.get('/selectUsername/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads username from the User Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT Username FROM User WHERE Username = " + "\'" + p.username + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.get('/getUserAccounts/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.get('/getAccountNames/:username/:accountName',[
    param('username').notEmpty(),
    param('accountName').notEmpty()],
    function(req, res, next) {
    /*
    Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
    where Username, Name matches username, accountName parameters
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'" + " AND Name = " + "\'" + p.accountName + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.get('/getAccountNumbers/:accountNumber',[
    param('accountNumber').isLength({ min: 8, max:8 })],
    function(req, res, next) {
    /*
    Reads Name, Type, Balance, Currency, Username, AccNumber from Account Table
    where AccNumber matches accountNumber parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT * FROM Account WHERE AccNumber = " + "\'" + p.accountNumber + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.post('/insertAccount/:accountName/:type/:balance/:currency/:username/:accountNumber', [
    param('accountName').notEmpty(),
    param('type').notEmpty(),
    param('balance').matches("^[0-9]+(\.[0-9]{1,2})?$"),
    param('currency').matches("[£$€]"),
    param('username').notEmpty(),
    param('accountNumber').isLength({ min: 8, max:8 })],
    function(req, res, next) {
    /*
    Creates a new record in the Account Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO Account (Name,Type,Balance,Currency,Username,AccNumber) " +
          "VALUES(" +
          "\'" + p.accountName + "\'," +
          "\'" + p.type + "\'," +
          +p.balance + "," +
          "\'" + p.currency + "\'," +
          "\'" + p.username + "\'," +
          "\'" + p.accountNumber + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.get('/getUserBalance/:accnumber', [
    param('accnumber').isLength({ min: 8, max:8 })],
    function(req, res, next) {
    /*
    Reads Balance and Currency from the Account Table
    where AccNumber matches accnumber parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT Balance,Currency FROM Account WHERE AccNumber = " + "\'" + p.accnumber + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.get('/getUserTransactions/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads TransactionId, Amount, DateTime, NameTo, AccNumberTo, AccNumberFrom, Reference and Tag from Transaction Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT * FROM Transaction WHERE EXISTS (SELECT * FROM Account WHERE (Transaction.AccNumberFrom = Account.AccNumber OR Transaction.AccNumberTo = Account.AccNumber) AND Account.Username = " + "\'" + p.username + "\'" + ")";
      console.log(query);
      doGet(query, res);
    }
});

router.post('/insertTransaction/:accFrom/:accNumber/:amount/:reference/:tag/:datetime/:accName',[
    param('accFrom').isLength({ min: 8, max:8 }),
    param('accNumber').isLength({ min: 8, max:8 }),
    param('amount').matches("^[0-9]+(\.[0-9]{1,2})?$"),
    param('datetime').matches("^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$"),
    param('accName').notEmpty()],
    function(req, res, next) {
    /*
    Creates a new record in the Transaction Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO Transaction (Amount,DateTime,NameTo,AccNumberTo,AccNumberFrom,Reference,Tag) " +
          "VALUES(" +
          "\'" + p.amount + "\'," +
          "\'" + p.datetime + "\'," +
          "\'" + p.accName + "\'," +
          "\'" + p.accNumber + "\'," +
          "\'" + p.accFrom + "\'," +
          "\'" + p.reference + "\'," +
          "\'" + p.tag + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.post('/insertFutureTransaction/:accFrom/:accNumber/:amount/:reference/:tag/:datetime/:accName',[
    param('accFrom').isLength({ min: 8, max:8 }),
    param('accNumber').isLength({ min: 8, max:8 }),
    param('amount').matches("^[0-9]+(\.[0-9]{1,2})?$"),
    param('datetime').matches("^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$"),
    param('accName').notEmpty()],
    function(req, res, next) {
    /*
    Creates a new record in the FutureTransaction Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO FutureTransaction (Amount,DateTime,NameTo,AccNumberTo,AccNumberFrom,Reference,Tag) " +
          "VALUES(" +
          "\'" + p.amount + "\'," +
          "\'" + p.datetime + "\'," +
          "\'" + p.accName + "\'," +
          "\'" + p.accNumber + "\'," +
          "\'" + p.accFrom + "\'," +
          "\'" + p.reference + "\'," +
          "\'" + p.tag + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.post('/setFavouritePayees/:username/:accName/:accNumber',[
    param('username').notEmpty(),
    param('accName').notEmpty(),
    param('accNumber').isLength({ min: 8, max:8 })],
    function(req, res, next){
    /*
    Creates a new record in the Favourites Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO Favourites (Username,Name,AccNumber) " +
          "VALUES(" +
          "\'" + p.username + "\'," +
          "\'" + p.accName + "\'," +
          "\'" + p.accNumber + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.get('/getFavouritePayees/:username', [
    param('username').notEmpty()],
    function(req, res, next) {
    /*
    Reads Name and AccNumber from Favourites Table
    where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT Name,AccNumber FROM Favourites WHERE Username = " + "\'" + p.username + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.get('/getAccountPayees/:accFrom', [
    param('accFrom').isLength({ min: 8, max:8 })],
    function(req, res, next) {
    /*
    Reads AccNumberTo and NameTo from Transaction Table
    where AccNumberFrom matches accFrom parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "SELECT AccNumberTo, NameTo FROM Transaction WHERE AccNumberFrom = " + "\'" + p.accFrom + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.post('/updateAccountBalance/:accNumber/:amount', [
    param('accNumber').isLength({ min: 8, max:8 }),
    param('amount').matches("^[-+]?[0-9]+(\.[0-9]{1,2})?$")],
    function(req, res, next) {
    /*
    Updates Balance in Account by amount parameter
    where AccNumber matches accNumber parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "UPDATE Account SET Balance = Balance + " + "\'" + p.amount + "\'" + " WHERE AccNumber = " + "\'" + p.accNumber + "\'";
      console.log(query);
      doPost(query, res);
    }
});

router.post('/setTag/:username/:tagName', [
    param('username').notEmpty(),
    param('tagName').notEmpty()],
    function(req, res, next){
    /*
      Creates a new record in the Tags Table
    */
    const errors=validationResult(req);
    if (errors.isEmpty()) {
      p = req.params;
      query = "INSERT INTO Tags (Username,Tag) " +
          "VALUES(" +
          "\'" + p.username + "\'," +
          "\'" + p.tagName + "\'" +
          ");";
      console.log(query);
      doPost(query, res);
    }
});

router.get('/getTag/:username',[
    param('username').notEmpty()],
    function(req, res, next) {
    /*
      Reads Tag from Tags Table
      where Username matches username parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()){
      p = req.params;
      query = "SELECT Tag FROM Tags WHERE Username = " + "\'" + p.username + "\'";
      console.log(query);
      doGet(query, res);
    }
});

router.post('/deleteTag/:username/:tagName',[
    param('username').notEmpty(),
    param('tagName').notEmpty()],
    function(req, res, next){
    /*
      Deletes a record from Tags Table
      where Username,Tag matches username,tagName parameter
    */
    const errors=validationResult(req);
    if (errors.isEmpty()){
      p = req.params;
      query = "DELETE FROM Tags WHERE Username = " + "\'" + p.username + "\'" + " AND Tag = " + "\'" + p.tagName + "\'";
      console.log(query);
      doPost(query, res);
    }
});

module.exports = router;