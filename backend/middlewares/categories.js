const connection = require("../connection");

function fetchCategories(req, res, next) {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      return res.status(404).send("No categories found");
    } //Esto no deberia pasar nunca 
    req.categories = results
    next();
  });
}

// Responde con las categorias adjuntados a req
function respondWithCategories(req, res) {
  if (!req.categories) return res.status(500).send("No categories available");
  return res.json(req.categories);
}

module.exports = { fetchCategories, respondWithCategories };