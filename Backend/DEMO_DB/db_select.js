var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM USERS", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });

  /* La data e' inserita in modo corretto (formato datetime), controlla tramite mysql! */