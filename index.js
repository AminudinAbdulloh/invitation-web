document.addEventListener("DOMContentLoaded", function () {
    // Reset kondisi halaman saat refresh
    window.scrollTo(0, 0);

    // Variabel Page
    const body = document.getElementById("body");
    const openPage = document.getElementById("open-page");
    const nextPage = document.getElementById("next-page");

    // Variabel Tombol Buka Undangan
    const openBtn = document.getElementById('open-btn');

    // Variabel Audio
    const audioTiara = document.getElementById("audio-tiara");
    const audioJalu = document.getElementById("audio-jalu");
    const musicBtns = document.getElementsByClassName("music-button");
    const musicTiaraButton = document.getElementById("music-tiara-button");
    const musicJaluButton = document.getElementById("music-jalu-button");
    const pauseTiaraIcon = document.getElementById("pause-tiara-icon");
    const playTiaraIcon = document.getElementById("play-tiara-icon");
    const pauseJaluIcon = document.getElementById("pause-jalu-icon");
    const playJaluIcon = document.getElementById("play-jalu-icon");
    
    // Pastikan kondisi awal sudah benar
    nextPage.classList.add("hidden"); // Pastikan next-page tersembunyi di awal
    
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
    openBtn.addEventListener("click", function () {
        body.classList.remove("overflow-hidden");
        nextPage.classList.remove("hidden");

        // Tunggu sejenak sebelum scrolling agar browser merender perubahan
        setTimeout(() => {
            smoothScrollTo(window.scrollY, nextPage.offsetTop, 1000, () => {
                // Setelah scroll selesai, sembunyikan halaman open-page
                openPage.classList.add("hidden");
                Array.from(musicBtns).forEach((musicBtn) => {
                    musicBtn.classList.remove("hidden");
                    musicBtn.classList.remove("absolute");
                    musicBtn.classList.add("fixed");
                    musicBtn.classList.add("flex");
                });
                audioTiara.play();
                audioJalu.pause();
            });
        }, 100);
    });

    // Tombol Buka Undangan
    musicTiaraButton.addEventListener("click", () => {
        toggleAudio(audioTiara, audioJalu, playTiaraIcon, pauseTiaraIcon, playJaluIcon, pauseJaluIcon);
    });
    
    musicJaluButton.addEventListener("click", () => {
        toggleAudio(audioJalu, audioTiara, playJaluIcon, pauseJaluIcon, playTiaraIcon, pauseTiaraIcon);
    });

    // Animasi scroll
        // 1. Animasi Ornamen Quote
            // Atas
            animatedScroll(".orn-18-quote", "slide-in-up", "2s", "ease", "0s", "1");
            animatedScroll2(".quote-title", [
                "animate-fade-up",
                "animate-duration-1500",
                "animate-delay-100"
            ]);
            // Ornamen Kiri
            animatedScroll(".orn-39-quote-left", "slide-in-down", "1.8s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-3-quote-left", "spinner-grow", "1.8s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-22-quote-left", "spinner-grow", "1.8s", "ease", "0s", "1");
            // Ornamen Kanan
            animatedScroll(".orn-39-quote-right", "slide-in-down", "1.8s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-3-quote-right", "spinner-grow", "1.8s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-22-quote-right", "spinner-grow", "1.8s", "ease", "0s", "1");

        // 2. Animasi Ornamen Couple
        animatedScroll2(".couple-title", [
            "animate-fade-down",
            "animate-duration-1500",
            "animate-delay-100"
        ]);
        animatedScroll2(".couple-description", [
            "animate-fade-up",
            "animate-duration-1500",
            "animate-delay-200"
        ]);
        animatedScroll2(".couple-detail", [
            "animate-fade-up",
            "animate-duration-1500",
            "animate-delay-200"
        ]);
            // Ornamen Kiri
            animatedScroll(".orn-couple-frame", "spinner-grow", "1.5s", "ease", "0s", "1");
            animatedScroll(".orn-2-couple-left", "slide-in-right", "2s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-38-couple", "slide-in-down", "1.5s", "ease", "0s", "1");
            animatedScroll(".orn-39-couple-left", "slide-in-down", "1.8s", "ease", "0s", "1");
            animatedScroll(".orn-11-couple-left", "slide-in-down", "2s", "ease", "0s", "1");
            animatedScroll(".orn-6-couple-left", "slide-in-down", "2s", "ease", "0s", "1");
            animatedScroll(".orn-4-couple-left", "fade-in-top-left", "2s", "ease", "0s", "1", "goyang");
            // Ornamen Kanan
            animatedScroll(".orn-couple-frame", "spinner-grow", "1.5s", "ease", "0s", "1");
            animatedScroll(".orn-2-couple-right", "slide-in-right", "2s", "ease", "0s", "1", "goyang");
            animatedScroll(".orn-38-couple", "slide-in-down", "1.5s", "ease", "0s", "1");
            animatedScroll(".orn-39-couple-right", "slide-in-down", "1.8s", "ease", "0s", "1");
            animatedScroll(".orn-11-couple-right", "slide-in-down", "2s", "ease", "0s", "1");
            animatedScroll(".orn-6-couple-right", "slide-in-down", "2s", "ease", "0s", "1");
            animatedScroll(".orn-4-couple-right", "fade-in-top-right", "2s", "ease", "0s", "1", "goyang");
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

function toggleAudio(currentAudio, otherAudio, playIcon, pauseIcon, otherPlayIcon, otherPauseIcon) {
    if (currentAudio.paused) {
        if (!otherAudio.paused) {
            otherAudio.pause();
            otherPauseIcon.classList.add("hidden");
            otherPlayIcon.classList.remove("hidden");
        }
        currentAudio.play();
        pauseIcon.classList.remove("hidden");
        playIcon.classList.add("hidden");
    } else {
        currentAudio.pause();
        pauseIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");
    }
}

function animatedScroll(selector, enterAnimation, duration = "1s", timingFunction = "ease-in-out", delay = "0.25s", iteration = "1", nextAnimation = null, threshold = 0.2) {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Cek apakah elemen sudah dianimasikan sebelumnya
                if (!element.classList.contains("animated-once")) {
                    element.style.animation = `${enterAnimation} ${duration} ${timingFunction} ${delay} ${iteration} forwards`;

                    setTimeout(() => {
                        element.style.transition = "opacity 0.25s ease-in-out"; // Menambahkan efek transisi
                        element.style.opacity = "1"; // Ubah opacity secara bertahap
                    }, parseFloat(delay) * 1000 + 500);

                    // Tambahkan event listener untuk mengatur animasi kedua
                    element.addEventListener("animationend", function animationEndHandler() {
                        element.classList.add("animated-once"); // Tandai bahwa animasi pertama sudah dilakukan

                        if (nextAnimation) {
                            requestAnimationFrame(() => {
                                element.style.animation = `${nextAnimation} 3.5s ease-in-out infinite alternate`;
                            });
                        }

                        element.removeEventListener("animationend", animationEndHandler);
                    });
                }
            }
        });
    }, { threshold });

    elements.forEach(element => observer.observe(element));
}

function animatedScroll2(selector, animations = [], threshold = 0.2) {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(...animations);
            }
        });
    }, { threshold });

    elements.forEach(element => observer.observe(element));
}