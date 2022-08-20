const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const path = require("path");
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

///connect database
ConnectDB();

///Routes



const userRoutes = require("./routers/userRoutes");
const postRoutes = require("./routers/postRoutes");

app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

// error handler middlewares
app.use(notFound);
app.use(errorHandler);

///port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
