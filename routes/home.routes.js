const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM categories", (err, catResult) => {
    if (err) throw err;

    db.query("SELECT COUNT(*) AS total FROM products", (err, prodResult) => {
      if (err) throw err;

      res.render("home", {
        totalCategories: catResult[0].total,
        totalProducts: prodResult[0].total
      });
    });
  });
});

module.exports = router;
