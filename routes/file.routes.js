import express from "express";
import {
    uploadHomepage,
    uploadImage,
    getImage,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/images/:brand/:name", getImage);
router.get("/", uploadHomepage);
router.post("/", uploadImage);

export default router;
