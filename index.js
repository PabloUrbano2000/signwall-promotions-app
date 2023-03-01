import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import fileRoutes from "./routes/file.routes.js";
import publicRoutes from "./routes/public.routes.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser
// app.use(cookieParser());

// Habilitar CSRF
// app.use(csrf({ cookie: true }));

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
app.use("/files", fileRoutes);
app.use("/", publicRoutes);

// Definir un puerto y arrancar el proyecto
const PORT = 3000;

app.listen(PORT, () => {
    console.log("El servidor está en el puerto", PORT);
});
