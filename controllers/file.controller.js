import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { brands } from "../services/global.js";
import { existFileAndDestroy, getDirName } from "../utils/path.js";
import {
    downloadFile,
    hasValidExtensions,
    generateFileName,
    uploadFile,
} from "../helpers/files.js";
import config from "../config/index.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadHomepage = (req, res) => {
    try {
        const activeBrands = brands.filter((brand) => brand.active === true);
        res.render("files/upload-files", {
            page: "Subir imágenes",
            description:
                "Esta es la página para que subas las imágenes necesarias",
            brands: activeBrands,
            formData: {},
        });
    } catch (error) {
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

const uploadImage = async (req, res) => {
    let { nombre, marca } = req.body;
    const activeBrands = brands.filter((b) => b.active === true) || [];
    try {
        const { archivo } = req?.files || {};
        let errors = [];
        if (!nombre) {
            errors.push({ msg: "El nombre no puede estar vacío" });
        }
        if (nombre && (nombre?.length > 50 || nombre?.length < 2)) {
            errors.push({ msg: "El nombre debe tener de 2 a 50 caracteres" });
        }
        if (nombre && !/^[A-Za-z0-9ñÑ\-\s]{2,50}$/.test(nombre.trim())) {
            errors.push({ msg: "El nombre solo acepta alfanuméricos" });
        }
        if (!marca) {
            errors.push({ msg: "La marca es obligatoria" });
        } else if (marca) {
            marca = marca.trim();
            const existBrand = activeBrands.find(
                (b) => b.name === marca && b.active === true
            );
            if (existBrand) {
                errors.push({ msg: "La marca no se encuentra disponible" });
            }
        }
        if (!archivo) {
            errors.push({ msg: "Debe seleccionar una imagen" });
        } else {
            const isValidFile = hasValidExtensions(archivo, [
                "png",
                "jpg",
                "jpeg",
            ]);
            isValidFile.status !== true
                ? errors.push({ msg: isValidFile.result })
                : null;
        }
        if (errors.length > 0) {
            return res.render("files/upload-files", {
                page: "Subir imágenes",
                description:
                    "Esta es la página para que subas las imágenes necesarias",
                brands: activeBrands,
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
        const imageNotFound = path.join(
            getDirName(),
            "../uploads",
            marca,
            fileName
        );

        // En caso exista eliminamos el archivo
        existFileAndDestroy(imageNotFound);

        const uploadResponse = await uploadFile(
            archivo,
            ["png", "jpg", "jpeg"],
            marca,
            fileName
        );

        if (uploadResponse.status !== true) {
            errors.push({ msg: uploadResponse.result });
            return res.render("files/upload-files", {
                page: "Subir imágenes",
                description:
                    "Esta es la página para que subas las imágenes necesarias",
                brands: activeBrands,
                formData: {
                    nombre: nombre || "",
                    marca: marca || "",
                },
                errors: errors,
            });
        }

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
        console.log(err);
        const errors = [];
        if (err.status === false) {
            errors.push({ msg: err.result });
        } else {
            errors.push({
                msg: "Ocurrió un error inesperado",
            });
        }
        return res.render("files/upload-files", {
            page: "Subir imágenes",
            description:
                "Esta es la página para que subas las imágenes necesarias",
            brands: activeBrands,
            formData: {
                nombre: nombre?.trim() || "",
                marca: marca || "",
            },
            errors: errors,
        });
    }
};

const uploadImageCloudinary = async (req, res) => {
    let { nombre, marca } = req.body;
    const activeBrands = brands.filter((b) => b.active === true) || [];
    try {
        const { archivo } = req?.files || {};
        let errors = [];
        if (!nombre) {
            errors.push({ msg: "El nombre no puede estar vacío" });
        }
        if (nombre && (nombre?.length > 50 || nombre?.length < 2)) {
            errors.push({ msg: "El nombre debe tener de 2 a 50 caracteres" });
        }
        if (nombre && !/^[A-Za-z0-9ñÑ\-\s]{2,50}$/.test(nombre.trim())) {
            errors.push({ msg: "El nombre solo acepta alfanuméricos" });
        }
        if (!marca) {
            errors.push({ msg: "La marca es obligatoria" });
        } else if (marca) {
            marca = marca.trim();
            const existBrand = activeBrands.find(
                (b) => b.name === marca && b.active === true
            );
            if (existBrand) {
                errors.push({ msg: "La marca no se encuentra disponible" });
            }
        }
        if (!archivo) {
            errors.push({ msg: "Debe seleccionar una imagen" });
        } else {
            const isValidFile = hasValidExtensions(archivo, [
                "png",
                "jpg",
                "jpeg",
            ]);
            isValidFile.status !== true
                ? errors.push({ msg: isValidFile.result })
                : null;
        }
        if (errors.length > 0) {
            return res.render("files/upload-files", {
                page: "Subir imágenes",
                description:
                    "Esta es la página para que subas las imágenes necesarias",
                brands: activeBrands,
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

        const cloud = await cloudinary.uploader.upload(tempFilePath, {
            filename_override: fileName,
            use_filename: true,
            public_id: fileName,
            folder: marca,
            overwrite: true,
            unique_filename: false,
        });

        const uploadResponse = await uploadFile(
            archivo,
            ["png", "jpg", "jpeg"],
            marca,
            fileName
        );

        if (uploadResponse.status === false) {
            errors.push({ msg: uploadResponse.result });
            return res.render("files/upload-files", {
                page: "Subir imágenes",
                description:
                    "Esta es la página para que subas las imágenes necesarias",
                brands: activeBrands,
                formData: {
                    nombre: nombre?.trim() || "",
                    marca: marca || "",
                },
                errors: errors,
            });
        }

        const restEndPoint = "/files/images/" + marca + "/" + fileName;

        res.render("files/upload-success", {
            page: "Imagen subida con éxito!",
            description: "Puedes consumir tu imagen en el siguiente endpoint:",
            response: {
                endpoint: restEndPoint,
            },
        });
    } catch (err) {
        console.log(err);
        const errors = [];
        if (err.status === false) {
            errors.push({ msg: err.result });
        } else {
            errors.push({
                msg: "Ocurrió un error inesperado",
            });
        }
        return res.render("files/upload-files", {
            page: "Subir imágenes",
            description:
                "Esta es la página para que subas las imágenes necesarias",
            brands: activeBrands,
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
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

export { uploadHomepage, uploadImage, uploadImageCloudinary, getImage };
