import express from "express";
import { body } from "express-validator";
import {
    uploadHomepage,
    uploadSuccessPage,
    uploadImageCloudinary,
    getImage,
} from "../controllers/file.controller.js";
import {
    fileExists,
    hasValidExtensions,
    hasValidSize,
} from "../middlewares/files.js";
import { brands } from "../services/global.js";

const router = express.Router();

router.get("/success/:publicId", uploadSuccessPage);

router.get("/images/:brand/:name", getImage);

router.get("/", uploadHomepage);
// router.post("/", uploadImage);

router.post(
    "/",
    [
        body("nombre")
            .notEmpty()
            .withMessage("El nombre no puede estar vacío")
            .custom((name) => {
                if (name) {
                    let newName = name?.trim() || "";
                    if (newName.length < 2 || newName > 50) {
                        throw new Error(
                            "El nombre debe tener de 2 a 50 caracteres"
                        );
                    } else if (!/^[A-Za-z0-9ñÑ\-\s]{2,50}$/.test(newName)) {
                        throw new Error("El nombre solo acepta alfanuméricos");
                    }
                }
                return true;
            }),

        body("marca")
            .notEmpty()
            .withMessage("La marca es obligatoria")
            .custom((m) => {
                const existBrand = brands.find(
                    (b) => b.id === m && b.active === true
                );
                if (m && !existBrand) {
                    throw new Error("La marca no se encuentra disponible");
                }
                return true;
            }),
        fileExists("archivo"),
        hasValidExtensions("archivo", ["jpg", "png", "jpeg"]),
        hasValidSize("archivo", 200000),
    ],
    uploadImageCloudinary
);

router.get("**/**", (req, res) => {
    return res.redirect("/404/");
});

export default router;
