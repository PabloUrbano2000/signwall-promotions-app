(function () {
    const inputFile = document.getElementById("archivo") || null;
    const containerPreview = document.getElementById("container-img-preview");

    if (containerPreview) {
        containerPreview.addEventListener("click", (ev) => {
            inputFile.click();
        });
    }

    if (inputFile) {
        inputFile.addEventListener("change", (ev) => {
            let files = ev.target.files;
            const containerPreview = document.getElementById(
                "container-img-preview"
            );
            if (containerPreview) {
                if (files && files.length) {
                    let imageCodified = URL.createObjectURL(files[0]);
                    let image = `<div class="w-auto mx-auto rounded" style="border: 2px gray dotted;">
                    <img class="p-2 w-auto flex mx-auto rounded" src="${imageCodified}" alt="preview">
                    </div>`;
                    containerPreview.innerHTML = image;
                } else {
                    containerPreview.innerHTML = `<div class="w-auto mx-auto rounded" style="border: 2px gray dotted;">
                    <p class="text-gray-300 bg-white mx-auto text-center w-auto" style="padding: 70px;">Selecciona una imagen</p>
                    </div>`;
                }
            }
        });
    }
})();
