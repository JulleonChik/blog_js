import { Router } from "express";
import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import { createPost } from "../controllers/posts.js";

const router = new Router();

// http://localhost:3003/posts

// Create post
router.post("/", checkAuthFilter, createPost);

export default router;
