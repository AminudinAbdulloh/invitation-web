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
    if (guestName) {
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

    // Tombol Music Undangan
    musicTiaraButton.addEventListener("click", () => {
        toggleAudio(audioTiara, audioJalu, playTiaraIcon, pauseTiaraIcon, playJaluIcon, pauseJaluIcon);
    });
    musicJaluButton.addEventListener("click", () => {
        toggleAudio(audioJalu, audioTiara, playJaluIcon, pauseJaluIcon, playTiaraIcon, pauseTiaraIcon);
    });

    // Tombol Kirim RSVP
    document.getElementById('send-rsvp').addEventListener('click', async function (e) {
        e.preventDefault();
        const button = e.currentTarget;
        const form = button.closest('form');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const alertGagal = document.getElementById('alert-gagal');
        const alertBerhasil = document.getElementById('alert-berhasil');
        const alertGagalText = document.getElementById('text-alert-gagal');
        const alertBerhasilText = document.getElementById('text-alert-berhasil');

        const sendText = document.getElementById('send-text');
        const loadingIcon = document.getElementById('loading-icon');

        // Reset alert
        alertGagal.classList.add('hidden');
        alertBerhasil.classList.add('hidden');

        // Ganti tombol jadi loading
        sendText.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
        button.disabled = true;

        const nama = document.getElementById('base-input').value;
        const kehadiran = document.getElementById('kehadiran').value;
        const jumlahTamu = Number(document.getElementById('jumlah-tamu').value);
        const ucapan = document.getElementById('ucapan').value;

        const data = { nama, kehadiran, jumlahTamu, ucapan };

        try {
            const response = await fetch('http://localhost:4000/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alertBerhasilText.textContent = 'RSVP berhasil dikirim!';
                alertBerhasil.classList.remove('hidden');

                // Tambahkan Ucapan ke dalam kontainer
                if (ucapan) {
                    const ucapanContainer = document.querySelector('.overflow-y-scroll');

                    const now = new Date();
                    const formattedDate = now.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'flex flex-col gap-2 bg-[var(--tertiary-color)] p-2 rounded-lg';
                    messageDiv.innerHTML = `
                    <span class="font-crimson text-sm text-[var(--primary-color)]">${nama}</span>
                    <span class="font-crimson text-xs text-[var(--quaternary-color)]">${formattedDate}</span>
                    <span class="font-crimson text-sm text-[var(--quaternary-color)]">${ucapan}</span>
                `;

                    // Sisipkan di awal (pesan terbaru di atas)
                    if (ucapanContainer.firstChild) {
                        ucapanContainer.insertBefore(messageDiv, ucapanContainer.firstChild);
                    } else {
                        ucapanContainer.appendChild(messageDiv);
                    }

                    // Scroll ke ucapan terbaru
                    ucapanContainer.scrollTop = 0;
                }

                form.reset();
            } else {
                const error = await response.json();
                alertGagalText.textContent = error.errors || 'Gagal mengirim RSVP.';
                alertGagal.classList.remove('hidden');
            }
        } catch (error) {
            alertGagalText.textContent = 'Terjadi kesalahan saat mengirim.';
            alertGagal.classList.remove('hidden');
        } finally {
            // Kembalikan tombol ke kondisi semula
            sendText.classList.remove('hidden');
            loadingIcon.classList.add('hidden');
            button.disabled = false;

            setTimeout(() => {
                alertGagal.classList.add('hidden');
                alertBerhasil.classList.add('hidden');
            }, 3000);
        }
    });

    // Event listener untuk tombol close alert
    document.querySelectorAll('button[data-dismiss-target]').forEach(button => {
        button.addEventListener('click', function () {
            const target = document.querySelector(this.getAttribute('data-dismiss-target'));
            if (target) target.classList.add('hidden');
        });
    });

    // Load Ucapan
    loadUcapan();

    // Count Down
    let endTime = new Date("May 18, 2025 08:00:00").getTime();
    startCountdown(endTime);

    // Animasi scroll
    animatedScroll2(".title", [
        "animate-fade-up",
        "animate-duration-1500",
        "animate-delay-100"
    ]);
    animatedScroll2(".description", [
        "animate-fade-up",
        "animate-duration-1500",
        "animate-delay-200"
    ]);
    animatedScroll2(".detail", [
        "animate-fade-up",
        "animate-duration-1500",
        "animate-delay-200"
    ]);
    animatedScroll(".line", "spinner-grow", "1.8s", "ease", "0s", "1");
    animatedScroll(".button", "spinner-grow", "1.8s", "ease", "0s", "1");
    animatedScroll(".image", "spinner-grow", "1.8s", "ease", "0s", "1");
    // 1. Animasi Ornamen Quote
    // Atas
    animatedScroll(".orn-18-quote", "slide-in-up", "2s", "ease", "0s", "1");
    // Ornamen Kiri
    animatedScroll(".orn-39-quote-left", "slide-in-down", "1.8s", "ease", "0s", "1", "goyang");
    animatedScroll(".orn-3-quote-left", "spinner-grow", "1.8s", "ease", "0s", "1", "goyang");
    animatedScroll(".orn-22-quote-left", "spinner-grow", "1.8s", "ease", "0s", "1");
    // Ornamen Kanan
    animatedScroll(".orn-39-quote-right", "slide-in-down", "1.8s", "ease", "0s", "1", "goyang");
    animatedScroll(".orn-3-quote-right", "spinner-grow", "1.8s", "ease", "0s", "1", "goyang");
    animatedScroll(".orn-22-quote-right", "spinner-grow", "1.8s", "ease", "0s", "1");

    // 2. Animasi Ornamen Couple
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

    // 3. Animasi Ornamen Footer
    // Other
    animatedScroll(".orn-footer", "spinner-grow", "1.8s", "ease", "0s", "1");

    // 4. Animasi Countdown
    animatedScroll(".countdown-item-day", "slide-in-down", "1.5s", "ease", "0s", "1");
    animatedScroll(".countdown-item-hour", "slide-in-up", "1.5s", "ease", "0s", "1");
    animatedScroll(".countdown-item-minute", "slide-in-down", "1.5s", "ease", "0s", "1");
    animatedScroll(".countdown-item-second", "slide-in-up", "1.5s", "ease", "0s", "1");

    showBackground("large-background", "block");

    // Copy to Clipboard
    document.addEventListener('click', function (event) {
        if (event.target.closest('.copy-rekening-bca-number')) {
            const button = event.target.closest('.copy-rekening-bca-number');
            const rekeningNumber = document.getElementById('rekening-bca-number')?.textContent || '';
            copyToClipboard(rekeningNumber, button);
        } else if (event.target.closest('.copy-rekening-bri-number')) {
            const button = event.target.closest('.copy-rekening-bri-number');
            const rekeningNumber = document.getElementById('rekening-bri-number')?.textContent || '';
            copyToClipboard(rekeningNumber, button);
        } else if (event.target.closest('.copy-alamat')) {
            const button = event.target.closest('.copy-alamat');
            const rekeningNumber = document.getElementById('alamat-rumah')?.textContent || '';
            copyToClipboard(rekeningNumber, button);
        }
    });

    // Image paths (in a real implementation, these would be your actual image paths)
    const imagePaths = [
        './assets/mempelai/m-1.jpeg',
        './assets/mempelai/m-2.jpeg',
        './assets/mempelai/m-3.jpeg',
        './assets/mempelai/m-4.jpeg',
        './assets/mempelai/m-5.jpeg',
        './assets/mempelai/m-6.jpeg',
    ];

    // Elements
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevSlide = document.getElementById('prevSlide');
    const nextSlide = document.getElementById('nextSlide');
    const slideCounter = document.getElementById('slideCounter');
    const galleryItems = document.querySelectorAll('.galery-photo');

    let currentIndex = 0;

    // Book Our Story
    const flipBook = (elBook) => {
        elBook.style.setProperty("--c", 0); // Set current page
        elBook.querySelectorAll(".page").forEach((page, idx) => {
            page.style.setProperty("--i", idx);
            page.addEventListener("click", (evt) => {
            if (evt.target.closest("a")) return;
            const curr = evt.target.closest(".back") ? idx : idx + 1;
            elBook.style.setProperty("--c", curr);
            });
        });
    };
    
    document.querySelectorAll(".book").forEach(flipBook);

    // Open lightbox when clicking on an image
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            currentIndex = parseInt(this.getAttribute('data-index'));
            openLightbox(currentIndex);
        });
    });

    // Close lightbox
    closeLightbox.addEventListener('click', function () {
        lightbox.classList.add('hidden');
        lightbox.style.display = 'none';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });

    // Navigate to previous slide
    prevSlide.addEventListener('click', function () {
        navigateSlide(-1);
    });

    // Navigate to next slide
    nextSlide.addEventListener('click', function () {
        navigateSlide(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (event) {
        if (lightbox.classList.contains('hidden')) return;

        if (event.key === 'Escape') {
            lightbox.classList.add('hidden');
        } else if (event.key === 'ArrowLeft') {
            navigateSlide(-1);
        } else if (event.key === 'ArrowRight') {
            navigateSlide(1);
        }
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
                                    element.style.animation = `${nextAnimation} 5s ease-in-out infinite alternate`;
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

    // Fungsi Count Down
    function startCountdown(targetDate) {
        function updateCountdown() {
            let now = new Date().getTime();
            let timeDiff = targetDate - now;

            if (timeDiff <= 0) {
                document.getElementById("day").innerHTML = "00";
                document.getElementById("hour").innerHTML = "00";
                document.getElementById("minute").innerHTML = "00";
                document.getElementById("second").innerHTML = "00";
                clearInterval(timer);
                return;
            }

            let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Jam
            let minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            let seconds = Math.floor((timeDiff / 1000) % 60);

            document.getElementById("day").innerHTML = String(days).padStart(2, '0');
            document.getElementById("hour").innerHTML = String(hours).padStart(2, '0'); // Menampilkan jam
            document.getElementById("minute").innerHTML = String(minutes).padStart(2, '0');
            document.getElementById("second").innerHTML = String(seconds).padStart(2, '0');
        }

        let timer = setInterval(updateCountdown, 1000);
        updateCountdown(); // Menjalankan langsung saat halaman dimuat
    }

    function showBackground(idTarget, position) {
        // Dapatkan elemen target yang ingin ditampilkan
        let target = document.getElementById(idTarget);

        // Buat elemen pemicu (Anda perlu menambahkan ini ke HTML Anda)
        // Misalnya: <div id="trigger-for-background" class="h-screen"></div>
        let trigger = document.getElementById("trigger-for-background");

        let observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    target.classList.remove("hidden");
                    target.classList.add(position);
                }
            });
        });

        // Amati elemen pemicu, bukan target
        observer.observe(trigger);
    }

    async function loadUcapan() {
        try {
            const response = await fetch('http://localhost:4000/api/ucapan');
            const result = await response.json();

            const ucapanContainer = document.querySelector('.ucapan');
            ucapanContainer.innerHTML = ''; // Kosongkan dulu kontainer

            result.data
                .filter(item => item.ucapan) // hanya ambil yang ada ucapan
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // urutkan terbaru ke lama
                .forEach(item => {
                    const tanggal = new Date(item.created_at);
                    const formattedDate = tanggal.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) + ', ' + tanggal.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'flex flex-col gap-2 bg-[var(--tertiary-color)] p-2 rounded-lg';
                    messageDiv.innerHTML = `
                        <span class="font-crimson text-sm md:text-xl lg:text-sm text-[var(--primary-color)]">${item.nama}</span>
                        <span class="font-crimson text-xs md:text-sm lg:text-xs text-[var(--quaternary-color)]">${formattedDate}</span>
                        <span class="w-auto font-crimson text-sm md:text-xl lg:text-sm text-[var(--quaternary-color)]">${item.ucapan}</span>
                    `;
                    ucapanContainer.appendChild(messageDiv);
                });

        } catch (error) {
            console.error('Gagal memuat data:', error);
        }
    }

    // Open lightbox with specific image
    function openLightbox(index) {
        lightboxImage.src = imagePaths[index];
        lightbox.classList.remove('hidden');
        lightbox.style.display = 'flex';
        updateSlideCounter();
    }

    // Navigate to previous or next slide
    function navigateSlide(direction) {
        currentIndex = (currentIndex + direction + imagePaths.length) % imagePaths.length;
        lightboxImage.src = imagePaths[currentIndex];
        updateSlideCounter();
    }

    // Update slide counter
    function updateSlideCounter() {
        slideCounter.textContent = `${currentIndex + 1} / ${imagePaths.length}`;
    }

    // Fungsi untuk menyalin teks ke clipboard
    function copyToClipboard(text, button) {
        // Menggunakan Clipboard API jika tersedia
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Panggil fungsi untuk update teks tombol jika berhasil
                    updateButtonText(button);
                })
                .catch(err => {
                    console.error('Gagal menyalin teks: ', err);
                });
        } else {
            // Fallback untuk browser yang tidak mendukung Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const success = document.execCommand('copy');
                if (success) {
                    // Panggil fungsi untuk update teks tombol jika berhasil
                    updateButtonText(button);
                }
            } catch (err) {
                console.error('Gagal menyalin teks: ', err);
            }

            document.body.removeChild(textarea);
        }
    }

    // Fungsi untuk mengubah teks tombol setelah diklik
    function updateButtonText(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#57411c" viewBox="0 0 448 512">
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
        </svg> Tersalin!
    `;

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }
});