import { Router } from "express";
import { checkAuthFilter } from "../utils/checkAuthFilter.js";
import { getMe, login, register } from "../controllers/auth.js";

const router = new Router();

//Registration
router.post("/register", register);

//Login
router.post("/login", login);

//Get info about me
router.get("/me", checkAuthFilter, getMe);

export default router;
