const express = require("express");
const db = require("../db"); // your db connection
const router = express.Router();

// GET all categories
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY category_id ASC", (err, categories) => {
    if (err) throw err;
    res.render("categories", { categories, message: null });
  });
});

// ADD new category
router.post("/add", (req, res) => {
  const name = req.body.category_name.trim();

  if (!name) return res.redirect("/categories");

  db.query("INSERT INTO categories (category_name) VALUES (?)", [name], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        // Fetch categories to show message
        db.query("SELECT * FROM categories ORDER BY category_id ASC", (err2, categories) => {
          if (err2) throw err2;
          res.render("categories", { categories, message: "Category already exists!" });
        });
      } else {
        throw err;
      }
    } else {
      res.redirect("/categories");
    }
  });
});

// DELETE category with confirmation handled in EJS
router.get("/delete/:id", (req, res) => {
  const categoryId = req.params.id;
  // optional: fetch category name for log or message
  db.query("SELECT category_name FROM categories WHERE category_id=?", [categoryId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect("/categories");

    db.query("DELETE FROM categories WHERE category_id=?", [categoryId], (err) => {
      if (err) {
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          // Prevent deletion if products exist
          db.query("SELECT * FROM categories ORDER BY category_id ASC", (err2, categories) => {
            if (err2) throw err2;
            res.render("categories", { categories, message: "Cannot delete category with products!" });
          });
        } else {
          throw err;
        }
      } else {
        res.redirect("/categories");
      }
    });
  });
});

// EDIT category - form
router.get("/edit/:id", (req, res) => {
  db.query("SELECT * FROM categories WHERE category_id=?", [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect("/categories");
    res.render("edit_category", { category: result[0] });
  });
});

// EDIT category - submit
router.post("/edit/:id", (req, res) => {
  const name = req.body.category_name.trim();
  db.query("UPDATE categories SET category_name=? WHERE category_id=?", [name, req.params.id], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        db.query("SELECT * FROM categories ORDER BY category_id ASC", (err2, categories) => {
          if (err2) throw err2;
          res.render("categories", { categories, message: "Category already exists!" });
        });
      } else {
        throw err;
      }
    } else {
      res.redirect("/categories");
    }
  });
});

module.exports = router;