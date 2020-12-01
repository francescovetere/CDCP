var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

const uuid = require('uuid').v4;
const UserID = uuid();
const today = new Date().toISOString().slice(0, 19).replace('T', ' ');  


// Per aggiustare la sintassi della query basta usare delle stringhe che contengano gia' gli apici per evitare errori di inserimento
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO USERS (ID, Nickname, Email, Password, RegistrationDate) VALUES ("+"'"+UserID+"'"+", 'prova', 'prova@gmail.com', 'passworasda',"+"'"+today+"'"+")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});