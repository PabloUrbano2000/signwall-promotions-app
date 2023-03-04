import { v2 as cloudinary } from "cloudinary";
import { brands } from "../services/global.js";
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
            const headerColor =
                brands.find((b) => b.id === brand)?.color || undefined;

            brand = brand.toLowerCase().trim();
            const { resources = [] } = await cloudinary.search
                .expression(`folder:${brand}`)
                .execute();

            const data = [];
            if (resources && resources.length > 0) {
                resources.map((img) => {
                    data.push(img);
                });

                return res.render("gallery/gallery-brand", {
                    page: "GALERÍA " + brand.toUpperCase(),
                    count: resources.length,
                    headerColor: headerColor,
                    data: data,
                });
            }

            return res.render("gallery/gallery-brand", {
                page: "GALERÍA " + brand.toUpperCase(),
                count: 0,
                headerColor: headerColor,
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
