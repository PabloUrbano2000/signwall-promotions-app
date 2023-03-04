import path from "path";
import fs from "fs";
import request from "request";
import { v4 as uuid4 } from "uuid";
import { getDirName } from "../utils/path.js";

const generateFileName = (
    file,
    brand = "",
    name = "",
    hasExtension = false
) => {
    const arrayName = name.split("");
    let nameWithRays = "";
    arrayName.forEach((c) => {
        let char = c.toLowerCase();
        if (char == "ñ") {
            nameWithRays = nameWithRays + "ni";
        } else if (char == " ") {
            let arrayFilter = nameWithRays.split("");
            if (arrayFilter[arrayFilter.length - 1] !== "_") {
                nameWithRays = nameWithRays + "_";
            }
        } else {
            nameWithRays = nameWithRays + char;
        }
    });

    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];
    return `${brand.toLowerCase()}_${nameWithRays}${
        hasExtension ? "." + extension : ""
    }`;
};

const hasValidExtensions = (
    file,
    validExtensions = ["png", "jpg", "jpeg", "gif"]
) => {
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
