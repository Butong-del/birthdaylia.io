document.addEventListener("DOMContentLoaded", () => {
    // Media Elements
    const bgAudio = document.getElementById("bgAudio");
    const playlistVideo = document.getElementById("playlistVideo");
    const btnPlayVideoSound = document.getElementById("btnPlayVideoSound");

    // Audio Autoplay Handling untuk Lagu Latar Belakang
    const playAudio = () => {
        if (bgAudio && bgAudio.paused) {
            bgAudio.play().catch(err => {
                console.log("Autoplay ditahan oleh browser, akan diputar saat ada interaksi:", err);
            });
        }
    };

    // Coba putar lagu otomatis saat dimuat
    playAudio();

    // Jika diproteksi browser, putar lagu pada interaksi/klik pertama
    document.body.addEventListener("click", () => {
        playAudio();
    }, { once: true });

    // Function untuk Berpindah Slide secara Mulus
    const showSlide = (targetSlideId) => {
        const slides = document.querySelectorAll(".slide");
        slides.forEach(slide => {
            if (slide.id === targetSlideId) {
                slide.classList.remove("hidden");
                setTimeout(() => slide.classList.add("active-slide"), 10);
            } else {
                slide.classList.remove("active-slide");
                slide.classList.add("hidden");
            }
        });

        // KELOLA SUARA SAAT PINDAH SLIDE
        if (targetSlideId === "slidePlaylist") {
            // Pause lagu latar belakang agar tidak bentrok dengan video
            if (bgAudio) {
                bgAudio.pause();
            }
            if (playlistVideo) {
                playlistVideo.currentTime = 0;
            }
        } else {
            // Pause video playlist jika keluar dari slide Playlist
            if (playlistVideo) {
                playlistVideo.pause();
            }
        }
    };

    // Tombol Khusus Putar Video Dengan Suara
    if (btnPlayVideoSound && playlistVideo) {
        btnPlayVideoSound.addEventListener("click", () => {
            // Hentikan lagu background
            if (bgAudio) {
                bgAudio.pause();
            }
            
            // Unmute dan putar video
            playlistVideo.muted = false;
            playlistVideo.volume = 1.0;
            playlistVideo.play().then(() => {
                console.log("Video berhasil diputar dengan suara.");
            }).catch(err => {
                console.log("Gagal memutar video:", err);
            });
        });
    }

    // ==========================================
    // SLIDE 1 -> SLIDE 2 TRANSITION
    // ==========================================
    const slide1 = document.getElementById("slide1");
    const envelopeFlap = document.getElementById("envelopeFlap");

    if (slide1) {
        slide1.addEventListener("click", () => {
            playAudio();
            if (envelopeFlap) {
                envelopeFlap.style.transform = "rotateX(180deg)";
            }
            setTimeout(() => {
                showSlide("slide2");
            }, 500);
        });
    }

    // ==========================================
    // SLIDE 2 -> SLIDE 3 (TAP FOR SURPRISE + CONFETTI)
    // ==========================================
    const btnSurprise = document.getElementById("btnSurprise");

    if (btnSurprise) {
        btnSurprise.addEventListener("click", (e) => {
            e.stopPropagation();
            playAudio();

            if (typeof confetti === "function") {
                confetti({
                    particleCount: 120,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            setTimeout(() => {
                showSlide("slide3");
            }, 800);
        });
    }

    // ==========================================
    // SLIDE 3 MENU INTERACTIONS
    // ==========================================
    const menuMoment = document.getElementById("menuMoment");
    const menuPlaylist = document.getElementById("menuPlaylist");
    const menuGift = document.getElementById("menuGift");
    const cameraFlash = document.getElementById("cameraFlash");

    // Moment Click
    if (menuMoment) {
        menuMoment.addEventListener("click", () => {
            playAudio();
            if (cameraFlash) {
                cameraFlash.style.opacity = "1";
                setTimeout(() => {
                    cameraFlash.style.opacity = "0";
                    showSlide("slideMoment");
                }, 300);
            } else {
                showSlide("slideMoment");
            }
        });
    }

    // Playlist Click
    if (menuPlaylist) {
        menuPlaylist.addEventListener("click", () => {
            showSlide("slidePlaylist");
        });
    }

    // Gift Click
    if (menuGift) {
        menuGift.addEventListener("click", () => {
            playAudio();
            showSlide("slideGift");
        });
    }

    // ==========================================
    // BACK BUTTONS LOGIC
    // ==========================================
    const btnBacks = document.querySelectorAll(".btnBack");
    btnBacks.forEach(btn => {
        btn.addEventListener("click", () => {
            if (playlistVideo) {
                playlistVideo.pause();
            }
            playAudio();
            showSlide("slide3");
        });
    });

    // ==========================================
    // GIFT SLIDE - MUSIC TOGGLE BUTTON
    // ==========================================
    const btnToggleMusic = document.getElementById("btnToggleMusic");
    const playIcon = document.getElementById("playIcon");
    const playText = document.getElementById("playText");
    const giftVinylIcon = document.getElementById("giftVinylIcon");

    if (btnToggleMusic) {
        btnToggleMusic.addEventListener("click", () => {
            if (bgAudio) {
                if (bgAudio.paused) {
                    bgAudio.play();
                    if (playIcon) playIcon.className = "fa-solid fa-pause";
                    if (playText) playText.textContent = "Pause Music";
                    if (giftVinylIcon) giftVinylIcon.classList.add("animate-spin-slow");
                } else {
                    bgAudio.pause();
                    if (playIcon) playIcon.className = "fa-solid fa-play";
                    if (playText) playText.textContent = "Play Music";
                    if (giftVinylIcon) giftVinylIcon.classList.remove("animate-spin-slow");
                }
            }
        });
    }
});

// Function Global untuk Modal Foto Lightbox
window.openPhotoModal = (src, caption) => {
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");

    if (modal && modalImg && modalCaption) {
        modalImg.src = src;
        modalCaption.textContent = caption;
        modal.classList.remove("hidden");
    }
};

window.closePhotoModal = () => {
    const modal = document.getElementById("photoModal");
    if (modal) {
        modal.classList.add("hidden");
    }
};