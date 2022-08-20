const mongoose = require("mongoose");
require('dotenv').config() 


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.AtlasDB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("mongo db connected");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB 