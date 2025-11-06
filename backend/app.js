const express = require("express");
const app = express();
const session = require("express-session"); // TODO: A revisar hoy todo lo relacionado con este modulo y con el archivo account.js
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173"], //puerto en donde react se aloja
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // En producción con HTTPS debe ser true
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    },
  })
);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

module.exports = app;