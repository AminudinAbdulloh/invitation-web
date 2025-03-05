document.addEventListener("DOMContentLoaded", function () {
    const body = document.getElementById("body");
    body.classList.add("overflow-hidden");

    document.getElementById("open-btn").addEventListener("click", function () {
        const open = document.getElementById("open-page");
        const nextPage = document.getElementById("next-page");
    
        open.classList.add("animate-fade-down");
        open.classList.add("animate-ease-linear");
        open.classList.add("animate-reverse");
        body.classList.remove("overflow-hidden");
        nextPage.classList.remove("hidden");
    });
})