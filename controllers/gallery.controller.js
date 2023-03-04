import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { brands } from "../services/global.js";
import { getDirName } from "../utils/path.js";
import {} from "../helpers/files.js";
import config from "../config/index.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
});

const galleryByBrand = async (req, res) => {
    try {
        let { brand } = req.params;
        if (brand) {
            brand = brand.toLowerCase().trim();
            const { resources = [] } = await cloudinary.search
                .expression(`folder:${brand}`)
                .execute();

            const data = [];

            console.log(resources);

            if (resources && resources.length > 0) {
                resources.map((img) => {
                    data.push(img);
                });

                return res.render("gallery/gallery-brand", {
                    page: "GALERÍA " + brand.toUpperCase(),
                    description: "El maldy estuvo aqui",
                    count: resources.length,
                    data: data,
                });
            }

            return res.render("gallery/gallery-brand", {
                page: "GALERÍA " + brand.toUpperCase(),
                description: "El maldy estuvo aqui",
                count: 0,
                data: [],
            });
        }

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

export { galleryByBrand };
