const homepage = (req, res) => {
    res.render("index", {
        pagina: "Bienvenido",
        descripcion: "Esta es la página para que subas las imágenes necesarias",
    });
};

export { homepage };
