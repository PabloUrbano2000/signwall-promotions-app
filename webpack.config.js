import path from "path";

export default {
    mode: "production",
    entry: {
        preview: "./src/js/preview.js",
        header: "./src/js/header.js",
        // agregarImagen: "./src/js/agregarImagen.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve("public/js"),
    },
};
