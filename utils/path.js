import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const getDirName = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return __dirname;
};

export const existFileAndDestroy = (pathImagen = "") => {
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};
