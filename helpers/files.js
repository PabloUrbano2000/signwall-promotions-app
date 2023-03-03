import path from "path";
import fs from "fs";
import request from "request";
import { v4 as uuid4 } from "uuid";
import { getDirName } from "../utils/path.js";

const generateFileName = (
    file,
    brand = "",
    nombre = "",
    hasExtension = false
) => {
    const nombreWithSpaces = nombre.split(" ");
    const joinNamesWithBar = nombreWithSpaces.join("_").toLowerCase();
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];
    return `${brand.toLowerCase()}_${joinNamesWithBar}${
        hasExtension ? "." + extension : ""
    }`;
};

const hasValidExtensions = (
    file,
    validExtensions = ["png", "jpg", "jpeg", "gif"]
) => {
    console.log("llego aqui");
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];

    // Validar la extensión
    if (!validExtensions.includes(extension)) {
        return {
            status: false,
            result: `La extensión ${extension} no es permitida - ${validExtensions}`,
        };
    }
    return {
        status: true,
    };
};

const uploadFile = (
    file,
    validExtensions = ["png", "jpg", "jpeg", "gif"],
    folder = "",
    fileName = ""
) => {
    return new Promise((resolve, reject) => {
        const shortName = file.name.split(".");
        const extension = shortName[shortName.length - 1];

        // Validar la extensión
        if (!validExtensions.includes(extension)) {
            reject({
                status: false,
                result: `La extensión ${extension} no es permitida - ${validExtensions}`,
            });
        } else {
            let temporalName = "";
            if (!fileName) {
                temporalName = uuid4() + "." + extension;
            } else {
                temporalName = fileName.split(".")[0] + "." + extension;
            }

            const uploadPath = path.join(
                getDirName(),
                "../uploads/",
                folder,
                temporalName
            );

            // sube en raiz el file
            file.mv(uploadPath, (err) => {
                if (err) {
                    reject({
                        status: false,
                        result: err,
                    });
                } else {
                    resolve({
                        status: true,
                        result: temporalName,
                    });
                }
            });
        }
    });
};

var downloadFile = function (uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            try {
                request(uri)
                    .pipe(fs.createWriteStream(filename))
                    .on("close", function () {
                        console.log(`${uri} image download!!`);
                        resolve(true);
                    });
            } catch (error) {
                reject(false);
            }
        });
    });
};

export { generateFileName, uploadFile, hasValidExtensions, downloadFile };
