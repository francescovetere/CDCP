var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var sql = "CREATE TABLE USERS (ID VARCHAR(36) PRIMARY KEY, Nickname VARCHAR(25), Email VARCHAR(50), Password VARCHAR(255), RegistrationDate DATETIME)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table USERS created");
  });

  var sql = "CREATE TABLE PROJECTS (ID VARCHAR(36) PRIMARY KEY, Title VARCHAR(50), InputType VARCHAR(20))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table PROJECTS created");
  });

  var sql = "CREATE TABLE EXAMPLES (ID VARCHAR(36) PRIMARY KEY, PROJECTS_ID VARCHAR(36), FOREIGN KEY (PROJECTS_ID) REFERENCES PROJECTS(ID), InputType VARCHAR(20), InputValue VARCHAR(100))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table EXAMPLES created");
  });

  var sql = "CREATE TABLE LABELS (PROJECTS_ID VARCHAR(36), FOREIGN KEY (PROJECTS_ID) REFERENCES PROJECTS(ID), EXAMPLES_ID VARCHAR(36), FOREIGN KEY (EXAMPLES_ID) REFERENCES EXAMPLES(ID), TAGName VARCHAR(36) PRIMARY KEY)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table LABELS created");
  });

  var sql = "CREATE TABLE TAGVALUES (PROJECTS_ID VARCHAR(36), FOREIGN KEY (PROJECTS_ID) REFERENCES PROJECTS(ID), EXAMPLES_ID VARCHAR(36), FOREIGN KEY (EXAMPLES_ID) REFERENCES EXAMPLES(ID), TAGName VARCHAR(36), FOREIGN KEY (TAGName) REFERENCES LABELS(TAGName), TAGValue VARCHAR(36) PRIMARY KEY)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table TAGVALUES created");
  });

  var sql = "CREATE TABLE LOGS (ID VARCHAR(36) PRIMARY KEY, EXAMPLES_ID VARCHAR(36), FOREIGN KEY (EXAMPLES_ID) REFERENCES EXAMPLES(ID), PROJECTS_ID VARCHAR(36), FOREIGN KEY (PROJECTS_ID) REFERENCES PROJECTS(ID), USERS_ID VARCHAR(36), FOREIGN KEY (USERS_ID) REFERENCES USERS(ID), ActionType VARCHAR(50), Details VARCHAR(255), TimeStamp DATETIME)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table LOGS created");
  });
});