var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator')
var mysql = require("mysql");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = {
	user:"user",
	password:"password",
	host:"localhost",
	port:33333,
	database:"stubank",
	//schema:"stubank",
	insecureAuth : true,
	multipleStatements:true
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

function updateAccountBalanceQuery(amount,accNumber){
	return "UPDATE Account SET Balance = Balance + " + "\'" + amount + "\'" + " WHERE AccNumber = "
		+ "\'" + accNumber + "\'";
}
function insertTransacationQuery(amount,dateTime,accName,accNumber,accFrom,reference,tag){
	return "INSERT INTO Transaction (Amount,DateTime,NameTo,AccNumberTo,AccNumberFrom,Reference,Tag) " +
		"VALUES(" +
		"\'" + amount + "\'," +
		"\'" + dateTime + "\'," +
		"\'" + accName + "\'," +
		"\'" + accNumber + "\'," +
		"\'" + accFrom + "\'," +
		"\'" + reference + "\'," +
		"\'" + tag + "\'" +
		");";
}

//this is maisie's function copied from react src/component/MoveMoneyFunctions.js
function currencyConverter(currencyFrom, currencyTo, amount) {
	//Returns the new amount corresponding to the currency of the users account
	let GBRtoUSD = 1.37;
	let GBRtoEUR = 1.12;
	let USDtoEUR = 0.82;
	let USDtoGBR = (1 / GBRtoUSD);
	let EURtoGBR = (1 / GBRtoEUR);
	let EURtoUSD = (1 / USDtoEUR);

	let newAmount = 0;

	if (currencyFrom !== currencyTo) {
		if (currencyFrom === "£") {
			if (currencyTo === "$") {
				newAmount = (amount * GBRtoUSD).toFixed(2)
			} else if (currencyTo === "€") {
				newAmount = (amount * GBRtoEUR).toFixed(2)
			}
		} else if (currencyFrom === "$") {
			if (currencyTo === "£") {
				newAmount = (amount * USDtoGBR).toFixed(2)
			} else if (currencyTo === "€") {
				newAmount = (amount * USDtoEUR).toFixed(2)
			}
		} else if (currencyFrom === "€") {
			if (currencyTo === "$") {
				newAmount = (amount * EURtoUSD).toFixed(2)
			} else if (currencyTo === "£") {
				newAmount = (amount * EURtoGBR).toFixed(2)
			}
		}
	}
	return (newAmount);

}

setInterval(()=>{
	const getFutureTranscationsQuery = "SELECT * From FutureTransaction"
	var con = mysql.createConnection(config)
	con.connect(
		(error) => {
			if(error) throw error;
			con.query(getFutureTranscationsQuery,(error,result) =>{
				if(error) throw error;
				for(var x of result) {
					console.log("Time until transaction " + x.FutureTransactionId + ": ",
						new Date(x.DateTime).getTime() - new Date().getTime())
					if (new Date(x.DateTime).getTime() - new Date().getTime() < 0) {

						let currencyFrom = null
						let currencyTo = null
						con.query("SELECT Currency FROM Account WHERE AccNumber = " + "\'" + x.AccNumberFrom + "\';" +
							"SELECT Currency FROM Account WHERE AccNumber = " + "\'" + x.AccNumberTo + "\'",(error,result) => {
							currencyFrom = result[0][0].Currency
							currencyTo = result[1][0].Currency


							console.log(currencyFrom,currencyTo)
							let amount = null
							if(currencyFrom !== currencyTo){
								amount = currencyConverter(currencyFrom,currencyTo,x.Amount)
							}
							else{
								amount = x.Amount
							}

							con.query(updateAccountBalanceQuery(amount, x.AccNumberTo))
							con.query(updateAccountBalanceQuery(x.Amount * -1, x.AccNumberFrom))
							const dateString = new Date(x.DateTime).toISOString().slice(0,19).replace("T", " ")
							con.query(insertTransacationQuery(x.Amount,dateString,x.NameTo,x.AccNumberTo,x.AccNumberFrom,x.Reference,x.Tag))
							con.query("DELETE FROM FutureTransaction WHERE FutureTransactionId = " + x.FutureTransactionId)
							con.end()
						})
					}
				}
			})
		}
	)
},1000)