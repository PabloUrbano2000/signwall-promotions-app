import path from "path";
import fs from "fs";
import { marcas } from "../services/global.js";
import { subirArchivo } from "../helpers/upload-file.js";
import { existFileAndDestroy, getDirName } from "../utils/path.js";

const generateNameImage = (files = {}, marca = "", nombre = "") => {
    const { archivo } = files;
    const nombreWithSpaces = nombre.split(" ");
    const joinNamesWithBar = nombreWithSpaces.join("_").toLowerCase();
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];
    return `${marca.toLowerCase()}_${joinNamesWithBar}.${extension}`;
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
        const pathImagen = path.join(
            getDirName(),
            "../uploads",
            marca,
            fileName
        );

        // En caso exista eliminamos el archivo
        existFileAndDestroy(pathImagen);

        const nombreImagen = await subirArchivo(
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

const getImage = (req, res) => {
    try {
        const { brand, name } = req.params;
        if (brand && name) {
            const pathImagen = path.join(
                getDirName(),
                "../uploads",
                brand,
                name.toLowerCase().trim() + ".jpg"
            );
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

        const pathImagen = path.join(getDirName(), "../assets/no-image.jpg");
        res.sendFile(pathImagen);
    } catch (err) {
        res.status(500).json({
            message: "Ocurrió un error inesperado",
        });
    }
};

export { uploadHomepage, uploadImage, getImage };
