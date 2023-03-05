const fileExists = (fileName = "archivo") => {
    return (req, res = response, next) => {
        if (
            !req?.files ||
            Object.keys(req?.files).length === 0 ||
            !req?.files[fileName]
        ) {
            const message = { msg: `Debe seleccionar una imagen` };
            req.customErrors = req.customErrors
                ? req.customErrors.push(message)
                : [message];
        }
        next();
    };
};

const hasValidExtensions = (fileName = "archivo", extensions) => {
    return (req, res = response, next) => {
        const file = req?.files ? req?.files[fileName] : null;
        if (file && Object.keys(file).length > 0) {
            const file = req.files[fileName];
            const shortName = file?.name?.split(".");
            const extension = shortName[shortName.length - 1];

            // Validar la extensión
            if (!extensions.includes(extension)) {
                const message = {
                    msg: `La extensión ${extension} no es permitida - ${extensions.join(
                        ", "
                    )}`,
                };
                if (req.customErrors && req.customErrors.length) {
                    req.customErrors = [...req.customErrors, message];
                } else {
                    req.customErrors = [message];
                }
            }
        }

        next();
    };
};

const hasValidSize = (fileName = "archivo", maxSize = 200000) => {
    return (req, res = response, next) => {
        const file = req?.files ? req?.files[fileName] : null;
        if (file && Object.keys(file).length > 0) {
            if (file.size > maxSize) {
                let auxSize = maxSize;
                let unit = "kb";
                if (maxSize < 1000000) {
                    unit = "kb";
                    auxSize = maxSize / 1000;
                } else {
                    unit = "mb";
                    auxSize = maxSize / 1000000;
                }

                const message = {
                    msg: `El archivo excede el tamaño máximo de ${auxSize}${unit}`,
                };
                if (req.customErrors && req.customErrors.length) {
                    req.customErrors = [...req.customErrors, message];
                } else {
                    req.customErrors = [message];
                }
            }
        }
        next();
    };
};

export { fileExists, hasValidExtensions, hasValidSize };
