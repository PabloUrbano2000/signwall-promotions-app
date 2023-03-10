import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import fileRoutes from "./routes/file.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import publicRoutes from "./routes/public.routes.js";

import dotenv from "dotenv";

dotenv.config();

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta Pública
app.use(express.static("public"));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
    })
);

// Routing
app.use("/files/", fileRoutes);
app.use("/gallery/", galleryRoutes);
app.use("/", publicRoutes);
app.use("**/**", (req, res) => res.redirect("/404/"));

// Definir un puerto y arrancar el proyecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("El servidor está en el puerto", PORT);
});
