const express = require("express");
const router = express.Router();
const {isAuthValid} =  require('../middlewares/isAuthValid')
const {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword,
} = require("../controllers/userControllers");

router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/current_user", isAuthValid , currentUser);
router.post("/forget_password" , forgetPassword);


module.exports = router;
