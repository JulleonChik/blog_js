import { Router } from "express";
import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import { createPost, getAllPosts, getPostById } from "../controllers/posts.js";

const router = new Router();

// http://localhost:3003/posts

// Create post
router.post("/", checkAuthFilter, createPost);
// Get All Posts
router.get("/", getAllPosts);
// Get Post By Id
router.get("/:id", getPostById);

export default router;
