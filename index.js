document.addEventListener("DOMContentLoaded", function () {
    // Nama Tamu Undangan
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");
    const guest = document.getElementById("guest-name");
    guest.innerText = guestName;

    // Tombol Buka Undangan
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
});