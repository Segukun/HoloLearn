const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173"], //puerto en donde react se aloja
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.use(express.json());
module.exports = app;