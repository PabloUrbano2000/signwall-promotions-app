const homepage = (req, res) => {
    try {
        res.render("index", {
            page: "¡BIENVENIDO!",
            description:
                "En esta página podrás subir las imágenes para las promociones desplegadas en PIANO, recuerda subir imágenes con responsabilidad :)",
        });
    } catch (err) {
        console.log("Error inesperado:", JSON.stringify(err || ""));
        res.render("index", {
            page: "¡BIENVENIDO!",
            description:
                "En esta página podrás subir las imágenes para las promociones desplegadas en PIANO, recuerda subir imágenes con responsabilidad :)",
        });
    }
};

export { homepage };
