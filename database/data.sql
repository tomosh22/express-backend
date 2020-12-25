CREATE TABLE Address(
                        AddressId int NOT NULL AUTO_INCREMENT,
                        Number varchar(45) NOT NULL ,
                        Street varchar(45) NOT NULL ,
                        TownOrCity varchar(45) NOT NULL ,
                        County varchar(45) NOT NULL ,
                        Postcode varchar(45) NOT NULL ,

                        PRIMARY KEY (AddressId)
);

CREATE TABLE User
(
    Username varchar(45) NOT NULL ,
    Password varchar(128) NOT NULL ,
    Salt char(16) NOT NULL ,
    FirstName varchar(45) NOT NULL ,
    SecondName varchar(45) NOT NULL ,
    Email varchar(45) NOT NULL ,
    AddressId int NOT NULL ,

    PRIMARY KEY (Username),
    FOREIGN KEY (AddressId) REFERENCES Address(AddressId)
);

CREATE TABLE Account
(
    Name varchar(45) NOT NULL ,
    Type varchar(45) NOT NULL ,
    Balance decimal(65,2) NOT NULL ,
    Currency varchar(45) NOT NULL ,
    Username varchar(45) NOT NULL ,
    AccNumber char(8) NOT NULL ,


    PRIMARY KEY (AccNumber),
    FOREIGN KEY (Username) REFERENCES User(Username)
);

CREATE TABLE Transaction
(
    TransactionId int NOT NULL AUTO_INCREMENT,
    Amount decimal(65,2) NOT NULL ,
    DateTime datetime NOT NULL ,
    AccNumberTo varchar(45) NOT NULL ,
    AccNumberFrom varchar(45) NOT NULL ,

    PRIMARY KEY (TransactionId),
    FOREIGN KEY (AccNumberTo) REFERENCES Account(AccNumber),
    FOREIGN KEY (AccNumberFrom) REFERENCES Account(AccNumber)
);
INSERT INTO Address VALUES (1,1,"Some Street","Some Town","Some County","Some Postcode");
INSERT INTO Address VALUES (2,1,"Another Street","Another Town","Another County","Another Postcode");
INSERT INTO User VALUES ("joeb","password","saltsaltsaltsalt","Joe","Bloggs","joeb@gmail.com",1);
INSERT INTO User VALUES("bobg","password","saltsaltsaltsalt","Bob","Green","bobg@gmail.com",2);
INSERT INTO Account VALUES("Joe's current account","current",100,"£","joeb","11111111");
INSERT INTO Account VALUES("Bob's current account","current",350,"£","bobg","22222222");
INSERT INTO Transaction VALUES(1,10,"2020-12-02 12:51:00","22222222","11111111");
INSERT INTO Transaction VALUES(2,20,"2020-12-02 13:00:00","22222222","11111111");
INSERT INTO Transaction VALUES(3,10,"2020-12-01 12:00:00","22222222","11111111");
