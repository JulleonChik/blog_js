import { Router } from "express";
import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import {
  createPost,
  deletePostById,
  updatePostById,
  getAllPosts,
  getMyPosts,
  getPostById,
  getAllPostComments,
} from "../controllers/posts.js";

const router = new Router();

// http://localhost:3003/api/posts

// Create post
router.post("/", checkAuthFilter, createPost);
// Get All Posts
router.get("/", getAllPosts);
// Get Post By Id
router.get("/:id", getPostById);
// Get My Posts
router.get("/user/myposts", checkAuthFilter, getMyPosts);
// Delete Post By Id
router.delete("/:id", checkAuthFilter, deletePostById);
// Update Post By Id
router.put("/:id", checkAuthFilter, updatePostById);
// Get All Post's comments
router.get("/:id/comments", getAllPostComments);

export default router;
