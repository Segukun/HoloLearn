const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");

// Conectar con el frontend
app.use(
  cors({
    origin: ["http://localhost:5173"], //puerto en donde react se aloja
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
// Configurar la sesión
app.use(
  session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // En producción con HTTPS debe ser true. por ahora no lo sera
      maxAge: 1000 * 60 * 60 * 24, // 24 horas. no lo hemos probado
    },
  })
);

// abrir el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

module.exports = app;