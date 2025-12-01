// # Gestion des filtres //

// On récupere le filtre séléctionné au click 
export function selectedFilter(callback) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const categoryId = button.dataset.categoryId;
            callback(categoryId); // appelle une fonction avec la valeur
        });
    });
}   