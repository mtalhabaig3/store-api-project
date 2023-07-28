require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const ProductsRouter = require("./routes/products");

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1> <a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", ProductsRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
