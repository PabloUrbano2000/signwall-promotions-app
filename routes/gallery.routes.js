import express from "express";
import { galleryByBrand } from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/:brand", galleryByBrand);

export default router;