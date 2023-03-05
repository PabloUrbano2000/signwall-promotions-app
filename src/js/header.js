(function () {
    const toogleButton = document.getElementById("toogle-button") || null;
    if (toogleButton) {
        toogleButton.addEventListener("click", (ev) => {
            const navListItem = document.getElementById("toogle-list") || null;
            if (navListItem) {
                if (navListItem.classList.contains("hidden")) {
                    navListItem.classList.remove("hidden");
                    navListItem.classList.add("block");
                } else {
                    navListItem.classList.remove("block");
                    navListItem.classList.add("hidden");
                }
            }
        });
    }
})();
