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
app.listen(3002)

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
  query = "SELECT Username,Salt,FirstName,SecondName,Email FROM User WHERE Username = "+"\'"+req.params.username+"\'";
  doGet(query,res);
});

router.get('/selectHashAndSalt/:username', function(req, res, next) {
  query = "SELECT Password,Salt FROM User WHERE Username = "+"\'"+req.params.username+"\'";
  doGet(query,res);
});

router.post('/insertAddress/:number/:street/:townorcity/:county/:postcode', function(req, res, next) {
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
  p = req.params;
  query = "SELECT AddressId FROM Address WHERE Number = "+"\'"+ p.number + "\'"+" AND Street = " + "\'"+p.street + "\'"+" " +
      "AND TownOrCity = "+"\'"+ p.townorcity + "\'"+" AND County = "+"\'"+ p.county + "\'"+" AND Postcode = " + "\'"+ p.postcode +"\'";
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
  console.log(query);
  doGet(query,res);
});

router.get('/getUserAccounts/:username', function(req, res, next) {
  p = req.params;
  query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'";
  console.log(query);
  doGet(query,res);
});
router.get('/getAccountNames/:username/:accountName', function(req, res, next) {
  p = req.params;
  query = "SELECT * FROM Account WHERE Username = " + "\'" + p.username + "\'"+ " AND Name = " + "\'" + p.accountName + "\'";
  console.log(query);
  doGet(query,res);
});
router.get('/getAccountNumbers/:accountNumber', function(req, res, next) {
  p = req.params;
  query = "SELECT * FROM Account WHERE AccNumber = " + "\'" + p.accountNumber + "\'";
  console.log(query);
  doGet(query,res);
});
router.post('/insertAccount/:accountName/:type/:balance/:currency/:username/:accountNumber', function(req, res, next) {
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
  p = req.params;
  query = "SELECT Balance,Currency FROM Account WHERE AccNumber = " + "\'" + p.accnumber + "\'";
  //query = "SELECT * FROM Address"
  console.log(query);
  doGet(query,res);
});
router.get('/getUserTransactions/:username', function(req, res, next) {
  p = req.params;
  query = "SELECT * FROM Transaction WHERE EXISTS (SELECT * FROM Account WHERE (Transaction.AccNumberFrom = Account.AccNumber OR Transaction.AccNumberTo = Account.AccNumber) AND Account.Username = " + "\'" + p.username + "\'"+")";
  console.log(query);
  doGet(query,res);
});
router.post('/insertTransaction/:accFrom/:accNumber/:currency/:amount/:reference/:tag/:datetime/:accName', function(req, res, next) {
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

router.post('/setFavouritePayees/:username/:accName/:accNumber', function(req, res, next){
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
  p = req.params;
  query = "SELECT Name,AccNumber FROM Favourites WHERE Username = " + "\'" + p.username + "\'";
  console.log(query);
  doGet(query,res);
});
router.get('/getAccountPayees/:accFrom', function(req, res, next) {
  p = req.params;
  query = "SELECT AccNumberTo, NameTo FROM Transaction WHERE AccNumberFrom = " + "\'" + p.accFrom + "\'";
  console.log(query);
  doGet(query,res);
});


router.post('/updateAccountBalance/:accNumber/:amount', function(req, res, next) {
  p = req.params;
  query = "UPDATE Account SET Balance = Balance + " + "\'" + p.amount + "\'" + " WHERE AccNumber = " + "\'" + p.accNumber + "\'";
  console.log(query);
  doPost(query,res);
});

router.post('/setTag/:username/:tagName', function(req, res, next){
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
      p = req.params;
      query = "DELETE FROM Tags WHERE Username = " + "\'" + p.username + "\'" + " AND Tag = " + "\'" + p.tagName + "\'";
      console.log(query);
      doPost(query, res);
    //}
});

module.exports = router;