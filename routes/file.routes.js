import express from "express";
import {
    uploadHomepage,
    uploadImage,
    uploadImageCloudinary,
    getImage,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/images/:brand/:name", getImage);
router.get("/", uploadHomepage);
// router.post("/", uploadImage);
router.post("/", uploadImageCloudinary);

export default router;
