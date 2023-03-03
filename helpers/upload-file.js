import path from "path";
import { v4 as uuid4 } from "uuid";
import { getDirName } from "../utils/path.js";

const uploadFile = (
    files,
    extensionesValidas = ["png", "jpg", "jpeg", "gif"],
    carpeta = "",
    nombreArchivo = ""
) => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extensión
        if (!extensionesValidas.includes(extension)) {
            reject(
                `La extensión ${extension} no es permitida - ${extensionesValidas}`
            );
        } else {
            let nombreTemp = "";
            if (!nombreArchivo) {
                nombreTemp = uuid4() + "." + extension;
            } else {
                nombreTemp = nombreArchivo.split(".")[0] + "." + extension;
            }

            const uploadPath = path.join(
                getDirName(),
                "../uploads/",
                carpeta,
                nombreTemp
            );

            // sube en raiz el archivo
            archivo.mv(uploadPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(nombreTemp);
                }
            });
        }
    });
};

export { uploadFile };
