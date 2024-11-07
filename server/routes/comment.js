import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import { createComment } from "../controllers/comments.js";
import { Router } from "express";

const router = new Router();

// http://localhost:3003/api/comments

// Create comment
router.post("/:id", checkAuthFilter, createComment);

export default router;
