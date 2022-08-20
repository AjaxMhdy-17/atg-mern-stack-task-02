const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Post = require("../models/postModel");
const { findByIdAndUpdate } = require("../models/userModel");
const User = require("../models/userModel");

const allPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  return res.status(200).json({
    posts,
  });
});

const singlePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) {
    res.status(404);
    throw new Error("Post Not Found");
  } else {
    return res.status(200).json({
      post,
    });
  }
});

const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (title.trim().length === 0 || description.trim().length === 0) {
    res.status(400);
    throw new Error("Title and Description Both Field Must be filled");
  } else {
    const user = await User.findById(req.user._id).select("-password"); 
    const createPost = await Post({
      user: user._id,
      title: title,
      description: description,
    });
    const newPost = await createPost.save();
    return res.status(200).json({
      newPost,
      message: "created successfully",
    });
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) {
    res.status(404);
    throw new Error("Post Not Found");
  } else {
    const { title, description } = req.body;
    if (title.trim().length === 0 || description.trim().length === 0) {
      res.status(400);
      throw new Error("Title and Description Both Field Must be filled");
    } else {
      if (post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("unauthorized user");
      } else {
        const post = await Post.findByIdAndUpdate(
          req.params.post_id,
          { title: title, description: description },
          {
            new: true,
          }
        );
        return res.status(200).json({
          post,
          message: "updated successfully",
        });
      }
    }
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) {
    res.status(404);
    throw new Error("Post Not Found");
  } else {
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("unauthorized user");
    } else {
      const post = await Post.findByIdAndDelete(req.params.post_id);
      return res.status(200).json({
        post,
        message: "deleted successfully",
      });
    }
  }
});

const likePost = asyncHandler(async (req, res) => {
  const findPost = await Post.findById(req.params.post_id);
  if (findPost) {
    const isLiked = findPost.likes.filter(
      (like) => like.user.toString() === req.user._id.toString()
    ).length;

    if (isLiked > 0) {
      throw new Error("Post Already Liked");
    } else {
      findPost.likes.unshift({
        user: req.user._id.toString(),
      });
      const likedPost = await findPost.save();
      return res.status(200).json({
        likedPost,
        message : "Post Liked"
      });
    }
  } else {
    res.status(404);
    throw new Error("No Post Found");
  }
});

const commentPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const user = await User.findById(req.user._id);
  if (text.trim().length !== 0) {
    if (user) {
      const findPost = await Post.findById(req.params.post_id);
      if (findPost) {
        const commentObj = {
          user: user._id.toString(),
          text: text,
          name: user.username,
        };
        findPost.comments.unshift(commentObj);
        const updatePostWithComment = await findPost.save()
        return res.status(200).json({
          updatePostWithComment , 
          message : "Commented Successfully"
        })
      } else {
        throw new Error("post not found");
      }
    } else {
      throw new Error("user not exists");
    }
  } else {
    res.status(400);
    throw new Error("Please Write something as a comment");
  }
});

module.exports = {
  createPost,
  allPosts,
  singlePost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
};
