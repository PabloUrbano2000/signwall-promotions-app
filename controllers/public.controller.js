const homepage = (req, res) => {
    res.render("index", {
        page: "¡BIENVENIDO!",
        description:
            "En esta página podrás subir las imágenes para las promociones desplegadas en PIANO, recuerda subir imágenes con responsabilidad :)",
    });
};

export { homepage };
