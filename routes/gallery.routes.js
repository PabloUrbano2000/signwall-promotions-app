import express from "express";
import { galleryByBrand } from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/:brand", galleryByBrand);

router.get("**/**", (req, res) => {
    return res.redirect("/404/");
});

export default router;
