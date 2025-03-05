document.addEventListener("DOMContentLoaded", function () {
    // Nama Tamu Undangan
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");
    const guest = document.getElementById("guest-name");
    if(guestName) {
        guest.innerText = guestName;
    } else {
        guest.innerText = "-";
    }

    // Tombol Buka Undangan
    const body = document.getElementById("body");
    body.classList.add("overflow-hidden");

    document.getElementById("open-btn").addEventListener("click", function () {
        const open = document.getElementById("open-page");
        const nextPage = document.getElementById("next-page");
        body.classList.remove("overflow-hidden");
        nextPage.classList.remove("hidden");

        // Tunggu sejenak sebelum scrolling agar browser merender perubahan
        setTimeout(() => {
            smoothScrollTo(window.scrollY, nextPage.offsetTop, 1000, () => {
                // Setelah scroll selesai, sembunyikan halaman open-page
                open.classList.add("hidden");
            });
        }, 100);
    });
});

function smoothScrollTo(start, end, duration, callback) {
    let startTime = null;

    function animationStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeInOut = progress < 0.5 ? 2 * progress ** 2 : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, start + (end - start) * easeInOut);

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            if (callback) callback(); // Panggil callback setelah scroll selesai
        }
    }

    requestAnimationFrame(animationStep);
}