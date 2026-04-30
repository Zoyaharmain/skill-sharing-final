import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET dashboard data
router.get("/", verifyJWT, getDashboard);

export default router;