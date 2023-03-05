import express from "express";
import { homepage, error404Page } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/404", error404Page);
router.get("/", homepage);

export default router;
