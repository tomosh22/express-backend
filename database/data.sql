CREATE TABLE Address
(
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
    Salt char(100) NOT NULL ,
    FirstName varchar(45) NOT NULL ,
    SecondName varchar(45) NOT NULL ,
    Email varchar(45) NOT NULL ,
    AddressId int NOT NULL ,
    Secret varchar(255) NOT NULL,

    PRIMARY KEY (Username),
    FOREIGN KEY (AddressId) REFERENCES Address(AddressId)
);

CREATE TABLE Admin
(
    AdminName varchar(45) NOT NULL ,
    Password varchar(128) NOT NULL ,
    Salt char(100) NOT NULL ,
    Email varchar(45) NOT NULL ,

    PRIMARY KEY (AdminName)
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

CREATE TABLE Favourites
(
    FavouriteId int NOT NULL AUTO_INCREMENT,
    Username varchar(45) NOT NULL ,
    Name varchar(45) NOT NULL ,
    AccNumber char(8) NOT NULL ,

    PRIMARY KEY (FavouriteId),
    FOREIGN KEY (Username) REFERENCES User(Username)
);

CREATE TABLE Tags
(
    TagId int NOT NULL AUTO_INCREMENT,
    Username varchar(45) NOT NULL ,
    Tag varchar(50) NOT NULL,

    PRIMARY KEY (TagId),
    FOREIGN KEY (Username) REFERENCES User(Username)
);

CREATE TABLE Transaction
(
    TransactionId int NOT NULL AUTO_INCREMENT,
    Amount decimal(65,2) NOT NULL ,
    DateTime datetime NOT NULL ,
    NameTo varchar(50) NOT NULL,
    AccNumberTo varchar(45) NOT NULL ,
    AccNumberFrom varchar(45) NOT NULL ,
    Reference varchar(20),
    Tag varchar(20),

    PRIMARY KEY (TransactionId),
    FOREIGN KEY (AccNumberTo) REFERENCES Account(AccNumber),
    FOREIGN KEY (AccNumberFrom) REFERENCES Account(AccNumber)
);

CREATE TABLE FutureTransaction
(
    FutureTransactionId int NOT NULL AUTO_INCREMENT,
    Amount decimal(65,2) NOT NULL ,
    DateTime datetime NOT NULL ,
    NameTo varchar(50) NOT NULL,
    AccNumberTo varchar(45) NOT NULL ,
    AccNumberFrom varchar(45) NOT NULL ,
    Reference varchar(20),
    Tag varchar(20),

    PRIMARY KEY (FutureTransactionId),
    FOREIGN KEY (AccNumberTo) REFERENCES Account(AccNumber),
    FOREIGN KEY (AccNumberFrom) REFERENCES Account(AccNumber)
);



INSERT INTO Address VALUES (1,1,"Some Street","Some Town","Some County","Some Postcode");

INSERT INTO User VALUES("netflix","password","saltsaltsaltsalt","netflix","netflix","netflix@gmail.com",1,"secret");
INSERT INTO User VALUES("spotify","password","saltsaltsaltsalt","spotify","spotify","spotify@gmail.com",1,"secret");
INSERT INTO User VALUES("puregym","password","saltsaltsaltsalt","puregym","puregym","puregym@gmail.com",1,"secret");
INSERT INTO User VALUES("mcdonalds","password","saltsaltsaltsalt","mcdonalds","mcdonalds","mcdonalds@gmail.com",1,"secret");
INSERT INTO User VALUES("ubereats","password","saltsaltsaltsalt","ubereats","ubereats","ubereats@gmail.com",1,"secret");
INSERT INTO User VALUES("asda","password","saltsaltsaltsalt","asda","asda","asda@gmail.com",1,"secret");
INSERT INTO User VALUES("aldi","password","saltsaltsaltsalt","aldi","aldi","aldi@gmail.com",1,"secret");
INSERT INTO User VALUES("amazon","password","saltsaltsaltsalt","amazon","amazon","amazon@gmail.com",1,"secret");

INSERT INTO Account VALUES("Netflix","current",100,"£","netflix","11111111");
INSERT INTO Account VALUES("Spotify","current",100,"£","spotify","22222222");
INSERT INTO Account VALUES("PureGym","current",100,"£","puregym","33333333");
INSERT INTO Account VALUES("McDonalds","current",100,"£","mcdonalds","44444444");
INSERT INTO Account VALUES("Uber Eats","current",100,"£","ubereats","55555555");
INSERT INTO Account VALUES("Asda","current",100,"£","asda","66666666");
INSERT INTO Account VALUES("Aldi","current",100,"£","aldi","77777777");
INSERT INTO Account VALUES("Amazon","current",100,"£","amazon","88888888");


INSERT INTO Admin VALUES ("admin", "7f7016b4dc620a7aa1b215a82b05f3e64e8c9446c4068f41f350e04c9b69852c984753db35478bf05baed6e3832b46e94666e5ba59e2a0b59c865d611a1bd5b9", "�0�U���o1W�O{�", "admin@admin.com")