// script.js — romantic animations, countdown, slider, surprise, music, particles

// =====================================================
//  ❤️  CUSTOMIZATION ZONE — EDIT YOUR CONTENT HERE ❤️ 
// =====================================================

// ---- 1) LANDING QUOTE (typewriter effect) ----
const loveQuotes = [
    "“You are my today and all of my tomorrows.”",
    "“Every love story is special, but ours is my favorite.”",
    "“In case you ever foolishly forget: I love you.”",
    "“I fell in love the way you fall asleep: slowly, then all at once.”"
];
// ---- 2) COUNTDOWN TARGET DATE (YYYY, MM-1, DD) ----
const COUNTDOWN_TARGET = new Date(2025, 1, 14, 0, 0, 0); // FEBRUARY 14, 2025 (month is 0-index)
// ---- 3) HANDWRITTEN / TYPEWRITER LOVE LETTER (feel free to edit) ----
const loveLetterText = `My love, from the moment we met, my world became softer, brighter, and full of music. Every day with you is a treasure. Thank you for being my home. Happy Valentine’s.`; 

// ---- 4) BACKGROUND MUSIC (replace with your own romantic song) ----
const MUSIC_SRC = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // demo song — REPLACE WITH YOUR OWN!

// =====================================================
// ==========   END OF CUSTOMIZATION   =================
// =====================================================

// ---------- FLOATING PARTICLES / HEARTS CANVAS ----------
const canvas = document.getElementById('floatingCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < 55; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 24 + 8,  // heart emoji size
            speedY: Math.random() * 1.2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.6 + 0.2,
            char: Math.random() > 0.5 ? '❤️' : '✨'
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        ctx.font = `${p.size}px Arial, 'Segoe UI Emoji'`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff99aa';
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.char, p.x, p.y);
        
        p.y -= p.speedY * 0.5; // upward floating
        p.x += p.speedX;
        
        if (p.y < -50) {
            p.y = height + 30;
            p.x = Math.random() * width;
        }
        if (p.x < -50) p.x = width + 20;
        if (p.x > width + 50) p.x = -20;
    }
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
    initCanvas();
});

// ---------- TYPEWRITER QUOTE (landing) ----------
let quoteIndex = 0;
let charIndex = 0;
let currentText = '';
let isDeleting = false;
const typewriterElement = document.getElementById('typewriterText');

function typeWriterEffect() {
    const fullQuote = loveQuotes[quoteIndex];
    
    if (isDeleting) {
        currentText = fullQuote.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = fullQuote.substring(0, charIndex + 1);
        charIndex++;
    }
    
    typewriterElement.innerHTML = currentText + '<span class="cursor">|</span>';
    
    if (!isDeleting && charIndex === fullQuote.length) {
        isDeleting = true;
        setTimeout(typeWriterEffect, 3000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % loveQuotes.length;
        setTimeout(typeWriterEffect, 400);
    } else {
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeWriterEffect, speed);
    }
}

// ---------- LOVE LETTER HANDWRITING (typewriter style) ----------
const handwritingEl = document.getElementById('handwritingMessage');
let letterIndex = 0;
function writeLoveLetter() {
    if (letterIndex < loveLetterText.length) {
        handwritingEl.innerHTML += loveLetterText.charAt(letterIndex);
        letterIndex++;
        setTimeout(writeLoveLetter, 70);
    }
}

// ---------- PHOTO SLIDER ----------
const track = document.getElementById('sliderTrack');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0;
let slideCount = slides.length;

function createDots() {
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

// ---------- SURPRISE POPUP + HEART EXPLOSION ----------
const surpriseBtn = document.getElementById('surpriseBtn');
const popup = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');

surpriseBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
    // extra heart explosion animation (adds burst class)
    const explosion = document.getElementById('heartExplosion');
    explosion.innerHTML = '❤️❤️❤️❤️❤️❤️❤️';
    setTimeout(() => { explosion.innerHTML = '❤️❤️❤️❤️❤️'; }, 200);
});
closePopup.addEventListener('click', () => { popup.style.display = 'none'; });
popup.addEventListener('click', (e) => { if (e.target === popup) popup.style.display = 'none'; });

// ---------- COUNTDOWN TIMER ----------
function updateCountdown() {
    const now = new Date().getTime();
    const target = COUNTDOWN_TARGET.getTime();
    const diff = target - now;
    
    if (diff <= 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('days').innerText = days.toString().padStart(2,'0');
    document.getElementById('hours').innerText = hours.toString().padStart(2,'0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2,'0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2,'0');
}

// ---------- BACKGROUND MUSIC (play/pause) ----------
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
let audio = new Audio(MUSIC_SRC);
audio.loop = true;
audio.volume = 0.4;

let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        musicIcon.className = 'fas fa-music-slash'; // requires fontawesome 6? fallback
        musicIcon.style.opacity = 0.7;
        musicText.innerText = 'Play song';
    } else {
        audio.play().catch(() => { /* autoplay blocked, but user clicked */ });
        musicIcon.className = 'fas fa-music';
        musicText.innerText = 'Pause song';
    }
    isMusicPlaying = !isMusicPlaying;
}
musicControl.addEventListener('click', toggleMusic);

// ---------- SMOOTH SCROLL for "Click to See My Love Story" ----------
document.getElementById('loveStoryBtn').addEventListener('click', () => {
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
});

// ---------- PARALLAX: subtle effect (moving canvas hearts already) ----------

// ---------- INITIALIZE ALL ----------
window.onload = () => {
    initCanvas();
    drawParticles();
    typeWriterEffect();
    writeLoveLetter();
    createDots();
    goToSlide(0);
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // adjust audio src comment – manual replace
    // (if audio fails, no worry)
};

// also reinit canvas if needed