import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { marcas } from "../services/global.js";
import { uploadFile } from "../helpers/upload-file.js";
import { existFileAndDestroy, getDirName } from "../utils/path.js";
import { download } from "../helpers/download-file.js";
import config from "../config/index.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
});

const generateNameImage = (
    files = {},
    marca = "",
    nombre = "",
    hasExtension = false
) => {
    const { archivo } = files;
    const nombreWithSpaces = nombre.split(" ");
    const joinNamesWithBar = nombreWithSpaces.join("_").toLowerCase();
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];
    return `${marca.toLowerCase()}_${joinNamesWithBar}${
        hasExtension ? "." + extension : ""
    }`;
};

const uploadHomepage = (req, res) => {
    try {
        const marcasActivas = marcas.filter((marca) => marca.activo === true);
        res.render("files/upload-files", {
            pagina: "Subir imágenes",
            descripcion:
                "Esta es la página para que subas las imágenes necesarias",
            marcas: marcasActivas,
            datos: {},
        });
    } catch (error) {
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

const uploadImage = async (req, res) => {
    let { nombre, marca } = req.body;
    const marcasActivas = marcas.filter((marca) => marca.activo === true) || [];
    try {
        const { archivo } = req?.files || {};
        let errores = [];
        if (!nombre) {
            errores.push({ msg: "El nombre no puede estar vacío" });
        }
        if (nombre && (nombre?.length > 50 || nombre?.length < 2)) {
            errores.push({ msg: "El nombre debe tener de 2 a 50 caracteres" });
        }
        if (nombre && !/^[A-Za-z0-9\-\s]{2,50}$/.test(nombre.trim())) {
            errores.push({ msg: "El nombre solo acepta alfanuméricos" });
        }
        if (!marca) {
            errores.push({ msg: "La marca es obligatoria" });
        } else if (marca) {
            marca = marca.trim();
            const existBrand = marcasActivas.find(
                (marca) => marca.nombre === marca && marca.activo === true
            );
            if (existBrand) {
                errores.push({ msg: "La marca no se encuentra disponible" });
            }
        }
        if (!archivo) {
            errores.push({ msg: "Debe seleccionar una imagen" });
        }
        if (errores.length > 0) {
            return res.render("files/upload-files", {
                pagina: "Subir imágenes",
                descripcion:
                    "Esta es la página para que subas las imágenes necesarias",
                marcas: marcasActivas,
                datos: {
                    nombre: nombre?.trim() || "",
                    marca: marca || "",
                },
                errores: errores,
            });
        }

        // Casteamos en minúsculas los datos
        nombre = nombre.toLowerCase().trim();
        marca = marca.toLowerCase().trim();

        const fileName = generateNameImage(req.files, marca, nombre);

        // Hay que borrar la imagen del servidor
        const imageNotFound = path.join(
            getDirName(),
            "../uploads",
            marca,
            fileName
        );

        // En caso exista eliminamos el archivo
        existFileAndDestroy(imageNotFound);

        const nombreImagen = await uploadFile(
            req.files,
            ["png", "jpg", "jpeg"],
            marca,
            fileName
        );

        const restEndPoint =
            "/files/images/" + marca + "/" + nombreImagen.split(".")[0];

        res.render("files/upload-success", {
            pagina: "Imagen subida con éxito!",
            descripcion: "Puedes consumir tu imagen en el siguiente endpoint:",
            response: {
                endpoint: restEndPoint,
            },
        });
    } catch (err) {
        const errores = [{ msg: "Ocurrió un error inesperado" + err }];
        return res.render("files/upload-files", {
            pagina: "Subir imágenes",
            descripcion:
                "Esta es la página para que subas las imágenes necesarias",
            marcas: marcasActivas,
            datos: {
                nombre: nombre?.trim() || "",
                marca: marca || "",
            },
            errores: errores,
        });
    }
};

const uploadImageCloudinary = async (req, res) => {
    let { nombre, marca } = req.body;
    const marcasActivas = marcas.filter((marca) => marca.activo === true) || [];
    try {
        const { archivo } = req?.files || {};
        let errores = [];
        if (!nombre) {
            errores.push({ msg: "El nombre no puede estar vacío" });
        }
        if (nombre && (nombre?.length > 50 || nombre?.length < 2)) {
            errores.push({ msg: "El nombre debe tener de 2 a 50 caracteres" });
        }
        if (nombre && !/^[A-Za-z0-9\-\s]{2,50}$/.test(nombre.trim())) {
            errores.push({ msg: "El nombre solo acepta alfanuméricos" });
        }
        if (!marca) {
            errores.push({ msg: "La marca es obligatoria" });
        } else if (marca) {
            marca = marca.trim();
            const existBrand = marcasActivas.find(
                (marca) => marca.nombre === marca && marca.activo === true
            );
            if (existBrand) {
                errores.push({ msg: "La marca no se encuentra disponible" });
            }
        }
        if (!archivo) {
            errores.push({ msg: "Debe seleccionar una imagen" });
        }
        if (errores.length > 0) {
            return res.render("files/upload-files", {
                pagina: "Subir imágenes",
                descripcion:
                    "Esta es la página para que subas las imágenes necesarias",
                marcas: marcasActivas,
                datos: {
                    nombre: nombre?.trim() || "",
                    marca: marca || "",
                },
                errores: errores,
            });
        }

        // Casteamos en minúsculas los datos
        nombre = nombre.toLowerCase().trim();
        marca = marca.toLowerCase().trim();

        const fileName = generateNameImage(req.files, marca, nombre);

        const { tempFilePath } = req.files.archivo;
        const cloud = await cloudinary.uploader.upload(tempFilePath, {
            filename_override: fileName,
            use_filename: true,
            public_id: fileName,
            folder: marca,
            overwrite: true,
            unique_filename: false,
        });

        const restEndPoint = "/files/images/" + marca + "/" + fileName;

        const nombreImagen = await uploadFile(
            req.files,
            ["png", "jpg", "jpeg"],
            marca,
            fileName
        );

        if (nombreImagen) {
            console.log("subido al servidor correctamente!");
        }

        res.render("files/upload-success", {
            pagina: "Imagen subida con éxito!",
            descripcion: "Puedes consumir tu imagen en el siguiente endpoint:",
            response: {
                endpoint: restEndPoint,
            },
        });
    } catch (err) {
        const errores = [{ msg: "Ocurrió un error inesperado: " + err }];
        return res.render("files/upload-files", {
            pagina: "Subir imágenes",
            descripcion:
                "Esta es la página para que subas las imágenes necesarias",
            marcas: marcasActivas,
            datos: {
                nombre: nombre?.trim() || "",
                marca: marca || "",
            },
            errores: errores,
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
                    const createFile = await download(imageUrl, filename);
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
