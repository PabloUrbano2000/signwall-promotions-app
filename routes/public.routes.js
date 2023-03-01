import express from "express";
import { homepage } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/", homepage);

export default router;
