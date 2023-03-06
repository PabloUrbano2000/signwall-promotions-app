import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { brands } from "../services/global.js";
import { existFileAndDestroy, getDirName } from "../utils/path.js";
import {
    downloadFile,
    generateFileName,
    uploadFile,
} from "../helpers/files.js";
import config from "../config/index.js";
import { validationResult } from "express-validator";

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadHomepage = (req, res) => {
    try {
        const activeBrands =
            brands?.filter((brand) => brand?.active === true) || [];
        let dataRender = {
            page: "Subir imágenes",
            description:
                "Esta es la página para que subas las imágenes necesarias",
            brands: activeBrands,
            csrfToken: encodeURI(req.csrfToken()),
            formData: {},
        };

        res.render("files/upload-files", dataRender);
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

const uploadImage = async (req, res) => {
    const activeBrands = brands?.filter((b) => b?.active === true) || [];
    let dataRender = {
        page: "Subir imágenes",
        description: "Esta es la página para que subas las imágenes necesarias",
        page: "Esta es la página para que subas las imágenes necesarias",
        brands: activeBrands,
        navBrands: activeBrands,
        formData: {},
    };

    let { nombre, marca } = req.body;
    const { archivo } = req?.files || {};
    try {
        let errors = [];

        const resultValidator = validationResult(req);
        const customErrors = req.customErrors || [];

        if (!resultValidator.isEmpty()) {
            errors = resultValidator.array();
        }
        if (customErrors.length > 0) {
            errors = [...errors, ...customErrors];
        }
        if (errors.length > 0) {
            return res.render("files/upload-files", {
                ...dataRender,
                formData: {
                    nombre: nombre?.trim() || "",
                    marca: marca || "",
                },
                errors: errors,
            });
        }

        // Casteamos en minúsculas los datos
        nombre = nombre.trim();
        marca = marca.trim();

        const fileName = generateFileName(archivo, marca, nombre);

        // Hay que borrar la imagen del servidor
        const currentFile = path.join(
            getDirName(),
            "../uploads",
            marca,
            fileName
        );

        // En caso exista eliminamos el archivo
        existFileAndDestroy(currentFile);

        const uploadResponse = await uploadFile(archivo, marca, fileName);

        const restEndPoint =
            "/files/images/" +
            marca +
            "/" +
            uploadResponse.result.split(".")[0];

        return res.render("files/upload-success", {
            page: "Imagen subida con éxito!",
            description: "Puedes consumir tu imagen en el siguiente endpoint:",
            response: {
                endpoint: restEndPoint,
            },
        });
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        const errors = [];
        if (err.status === false) {
            errors.push({ msg: err.result });
        } else {
            errors.push({
                msg: "Ocurrió un error inesperado",
            });
        }
        return res.render("files/upload-files", {
            ...dataRender,
            formData: {
                nombre: nombre?.trim() || "",
                marca: marca || "",
            },
            errors: errors,
        });
    }
};

const uploadImageCloudinary = async (req, res) => {
    const activeBrands = brands?.filter((b) => b?.active === true) || [];
    let dataRender = {
        page: "Subir imágenes",
        description: "Esta es la página para que subas las imágenes necesarias",
        page: "Esta es la página para que subas las imágenes necesarias",
        brands: activeBrands,
        navBrands: activeBrands,
        csrfToken: encodeURI(req.csrfToken()),
        formData: {},
    };

    let { nombre, marca } = req.body;
    const { archivo } = req?.files || {};

    try {
        let errors = [];

        const resultValidator = validationResult(req);
        const customErrors = req.customErrors || [];

        if (!resultValidator.isEmpty()) {
            errors = resultValidator.array();
        }
        if (customErrors.length > 0) {
            errors = [...errors, ...customErrors];
        }
        if (errors.length > 0) {
            return res.render("files/upload-files", {
                ...dataRender,
                formData: {
                    nombre: nombre?.trim() || "",
                    marca: marca || "",
                },
                errors: errors,
            });
        }

        // Casteamos en minúsculas los datos
        nombre = nombre.toLowerCase().trim();
        marca = marca.toLowerCase().trim();

        const fileName = generateFileName(archivo, marca, nombre);

        const { tempFilePath } = archivo;

        // subiendolo a cloudinary
        await cloudinary.uploader.upload(tempFilePath, {
            filename_override: fileName,
            use_filename: true,
            public_id: fileName,
            folder: marca,
            overwrite: true,
            unique_filename: false,
        });

        // subiendo al servidor
        await uploadFile(archivo, marca, fileName);

        return res.redirect("/files/success/" + fileName + "/");
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        const errors = [];
        if (err.status === false) {
            errors.push({ msg: err.result });
        } else {
            errors.push({
                msg: "Ocurrió un error inesperado",
            });
        }
        return res.render("files/upload-files", {
            ...dataRender,
            formData: {
                nombre: nombre?.trim() || "",
                marca: marca || "",
            },
            errors: errors,
        });
    }
};

const getImage = async (req, res) => {
    try {
        let { brand, name } = req.params;
        if (brand && name) {
            brand = brand.toLowerCase();
            name = name.toLowerCase();

            const publicId = `${brand}/${name}`;

            // Hay que buscar imagen en el servidor
            let currentFile = path.join(getDirName(), "../uploads", publicId);

            // En caso de que exista en servidor
            const extensions = ["jpg", "png", "jpeg"];
            for (let ext of extensions) {
                const newCurrentFile = currentFile + "." + ext;
                if (fs.existsSync(newCurrentFile)) {
                    return res.sendFile(newCurrentFile);
                }
            }

            const { resources = [] } = await cloudinary.search
                .expression(`public_id:${publicId}`)
                .execute();

            if (resources && resources.length > 0) {
                const { secure_url: imageUrl } = resources[0];
                const secureUrlParse = imageUrl.split("/");

                const getFileNameWithExtension =
                    secureUrlParse[secureUrlParse.length - 1];

                // Fichero de salida con el directorio al que vamos a guardar
                const filename =
                    "uploads/" + brand + "/" + getFileNameWithExtension;
                const pathFile = path.join(getDirName(), "..", filename);
                if (!fs.existsSync(pathFile)) {
                    console.log("no existe en servidor...");
                    console.log("generando archivo...");
                    const createFile = await downloadFile(imageUrl, filename);
                    if (createFile) {
                        console.log("archivo reconstruido exitosamente!");
                        return res.sendFile(pathFile);
                    }
                }
                return res.sendFile(pathFile);
            }
        }

        const imageNotFound = path.join(getDirName(), "../assets/no-image.jpg");
        return res.sendFile(imageNotFound);
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

const uploadSuccessPage = async (req, res) => {
    try {
        const { publicId } = req.params || {};

        if (!publicId) {
            res.redirect("/");
        }

        const publicIdParts = publicId.split("_");

        const newPublicId = publicIdParts[0] + "/" + publicId;

        const restEndPoint = "/files/images/" + newPublicId;

        return res.render("files/upload-success", {
            page: "Imagen subida con éxito!",
            description: "Puedes consumir tu imagen en el siguiente endpoint:",
            response: {
                endpoint: restEndPoint,
            },
        });
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        return res.redirect("/");
    }
};

export {
    uploadHomepage,
    uploadImage,
    uploadImageCloudinary,
    uploadSuccessPage,
    getImage,
};
