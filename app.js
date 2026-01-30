const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const home = require('./routes/home.routes')

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

// ✅ STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.get("/",home)

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});