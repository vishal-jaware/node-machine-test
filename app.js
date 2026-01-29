const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

// ✅ HOME DASHBOARD (REAL DATA)
app.get("/", (req, res) => {
  const categoryCountQuery = "SELECT COUNT(*) AS totalCategories FROM categories";
  const productCountQuery = "SELECT COUNT(*) AS totalProducts FROM products";

  db.query(categoryCountQuery, (err, catResult) => {
    if (err) throw err;

    db.query(productCountQuery, (err, prodResult) => {
      if (err) throw err;

      res.render("home", {
        totalCategories: catResult[0].totalCategories,
        totalProducts: prodResult[0].totalProducts
      });
    });
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
