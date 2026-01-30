const express = require("express");
const db = require("../db");
const router = express.Router();

// LIST products with pagination
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = 10;
  const offset = (page - 1) * size;

  const countQuery = "SELECT COUNT(*) AS total FROM products";

  db.query(countQuery, (err, countResult) => {
    if (err) throw err;
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / size);

    const productQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        c.category_id,
        c.category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.product_id ASC
      LIMIT ? OFFSET ?
    `;

    db.query(productQuery, [size, offset], (err, products) => {
      if (err) throw err;
      db.query("SELECT * FROM categories", (err, categories) => {
        if (err) throw err;
        res.render("products", {
          products,
          categories,
          page,
          totalPages,
          message: null
        });
      });
    });
  });
});

// ADD product
router.post("/add", (req, res) => {
  const { product_name, category_id } = req.body;
  db.query(
    "INSERT INTO products (product_name, category_id) VALUES (?, ?)",
    [product_name, category_id],
    (err) => {
      if (err) throw err;
      res.redirect("/products");
    }
  );
});

// DELETE product
router.get("/delete/:id", (req, res) => {
  const productId = req.params.id;
  db.query("DELETE FROM products WHERE product_id=?", [productId], (err) => {
    if (err) throw err;
    res.redirect("/products");
  });
});

// EDIT product form
router.get("/edit/:id", (req, res) => {
  const productId = req.params.id;
  db.query("SELECT * FROM products WHERE product_id=?", [productId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect("/products");

    db.query("SELECT * FROM categories", (err, categories) => {
      if (err) throw err;
      res.render("edit_product", { product: result[0], categories });
    });
  });
});

// UPDATE product
router.post("/edit/:id", (req, res) => {
  const productId = req.params.id;
  const { product_name, category_id } = req.body;
  db.query(
    "UPDATE products SET product_name=?, category_id=? WHERE product_id=?",
    [product_name, category_id, productId],
    (err) => {
      if (err) throw err;
      res.redirect("/products");
    }
  );
});

module.exports = router;