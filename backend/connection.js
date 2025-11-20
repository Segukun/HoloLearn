const mysql = require("mysql2");
// Crear coneccion a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asdf", // tu contraseña de MySQL si tiene es asdf en mysqlworkbench y vacio en xammp
  database: "hololearn",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar:", err);
    return;
  }
  console.log("Conectado a MySQL!");
});

module.exports = connection;