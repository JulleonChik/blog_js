import { Router } from "express";
import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
} from "../controllers/posts.js";

const router = new Router();

// http://localhost:3003/posts

// Create post
router.post("/", checkAuthFilter, createPost);
// Get All Posts
router.get("/", getAllPosts);
// Get Post By Id
router.get("/:id", getPostById);
// Get My Posts
router.get("/user/myposts", checkAuthFilter, getMyPosts);

export default router;
