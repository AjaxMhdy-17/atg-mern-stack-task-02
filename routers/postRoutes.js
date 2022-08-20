const express = require("express");
const router = express.Router();
const { isAuthValid } = require("../middlewares/isAuthValid");
const {
  createPost,
  allPosts,
  singlePost,
  updatePost,
  deletePost,
  likePost,
  commentPost
} = require("../controllers/postControllers");

router.get("/all_posts", allPosts);
router.get("/single_post/:post_id", singlePost);
router.post("/create", isAuthValid, createPost);
router.put("/update/single/:post_id", isAuthValid, updatePost);
router.delete("/delete/single/:post_id", isAuthValid, deletePost);
router.put("/like/single/:post_id" , isAuthValid , likePost);
router.post("/comment/single/:post_id" , isAuthValid , commentPost);

module.exports = router;
