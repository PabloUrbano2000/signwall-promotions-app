import path from "path";

export default {
  mode: "development",
  entry: {
    preview: "./src/js/preview.js",
    // agregarImagen: "./src/js/agregarImagen.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("public/js"),
  },
};
