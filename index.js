require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const warehouseRoutes = require("./routes/warehouseRoute");
const inventoryRoutes = require("./routes/inventoryRoute");

// all warehouses routes
app.use("/warehouses", warehouseRoutes);
app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`running on Port: ${PORT}`);
});
