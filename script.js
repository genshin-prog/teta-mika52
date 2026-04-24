// ===== SCREAMER DATA =====
const screamers = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrN8iLE9kecEXr0RW3OQlQLvNaCgMO5V68AQ&s",
    sound: 440,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQymHew8PNHYVA-INuK-Az_Cfccu5jqSSyq6w&s",
    sound: 660,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDN_ljsK8oUtHl-HYBSbV2TeES-8diX_Sgiw&s",
    sound: 880,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdwWLcjG7GTaoMvt8xiczl4tky0urAuTrLRA&s",
    sound: 550,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5QqPGX1Yuko09LbV_fNwUrwrQsgn55za81g&s",
    sound: 770,
  },
];

// ===== TRIGGER SCREAMER =====
function triggerScreamer(index) {
  const data = screamers[index % screamers.length];
  const screamer = document.getElementById("screamer");
  const img = document.getElementById("screamer-img");

  img.src = data.img;
  screamer.classList.remove("hidden");

  // Play beep sound
  playBeep(data.sound);

  // Launch confetti
  launchConfetti();

  // Shake the page
  document.body.style.animation = "none";
  document.body.offsetHeight; // reflow
  shakePage();

  // Close after 3 seconds
  setTimeout(() => {
    screamer.classList.add("hidden");
  }, 3000);

  // Click anywhere to close
  screamer.onclick = () => screamer.classList.add("hidden");
}

// ===== PAGE SHAKE =====
function shakePage() {
  let shakeCount = 0;
  const interval = setInterval(() => {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    document.body.style.transform = `translate(${x}px, ${y}px)`;
    shakeCount++;
    if (shakeCount > 20) {
      clearInterval(interval);
      document.body.style.transform = "";
    }
  }, 50);
}

// ===== BEEP SOUND =====
function playBeep(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(freq * 2, ctx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  } catch (e) {
    console.log("Audio not supported");
  }
}

// ===== CONFETTI =====
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiActive = false;
let animationId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function createConfettiPiece() {
  return {
    x: Math.random() * canvas.width,
    y: -10,
    w: Math.random() * 12 + 6,
    h: Math.random() * 6 + 3,
    color: `hsl(${Math.random() * 360}, 90%, 60%)`,
    speed: Math.random() * 5 + 3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3,
    wobble: Math.random() * 0.1,
    wobbleSpeed: Math.random() * 0.05,
    wobblePos: 0,
  };
}

function launchConfetti() {
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      confettiPieces.push(createConfettiPiece());
    }, i * 20);
  }

  if (!confettiActive) {
    confettiActive = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 20);

  confettiPieces.forEach(p => {
    p.y += p.speed;
    p.angle += p.spin;
    p.wobblePos += p.wobbleSpeed;
    const wobbleX = Math.sin(p.wobblePos) * 3;

    ctx.save();
    ctx.translate(p.x + wobbleX, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ===== FLOATING EMOJIS =====
const emojiList = ["🎉", "🎊", "🎂", "🎈", "⭐", "✨", "🔥", "💥", "🎁", "🎖️", "💀", "😂", "🫡"];

function spawnFloatingEmoji() {
  const container = document.getElementById("floating-emojis");
  const el = document.createElement("div");
  el.className = "floating-emoji";
  el.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = (Math.random() * 2 + 1) + "rem";
  const dur = Math.random() * 8 + 6;
  el.style.animationDuration = dur + "s";
  el.style.animationDelay = Math.random() * 2 + "s";
  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + 2) * 1000);
}

setInterval(spawnFloatingEmoji, 600);

// ===== PHOTO CARD JOKE TOOLTIPS =====
const tooltip = document.getElementById("joke-tooltip");
const photoCards = document.querySelectorAll(".photo-card");

photoCards.forEach(card => {
  card.addEventListener("mouseenter", (e) => {
    tooltip.textContent = card.dataset.joke;
    tooltip.classList.remove("hidden");
    positionTooltip(e);
  });

  card.addEventListener("mousemove", positionTooltip);

  card.addEventListener("mouseleave", () => {
    tooltip.classList.add("hidden");
  });

  card.addEventListener("click", () => {
    // Random screamer on photo click
    const idx = Math.floor(Math.random() * screamers.length);
    triggerScreamer(idx);
  });
});

function positionTooltip(e) {
  let x = e.clientX + 15;
  let y = e.clientY + 15;
  if (x + 300 > window.innerWidth) x = e.clientX - 315;
  if (y + 100 > window.innerHeight) y = e.clientY - 100;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

// ===== COUNTDOWN TIMER (random "scary" countdown) =====
function updateTimer() {
  // Random scary countdown
  const daysLeft = Math.floor(Math.random() * 30) + 5;
  const hoursLeft = Math.floor(Math.random() * 24);
  const minutesLeft = Math.floor(Math.random() * 60);
  const secondsLeft = Math.floor(Math.random() * 60);

  document.getElementById("days").textContent = String(daysLeft).padStart(2, "0");
  document.getElementById("hours").textContent = String(hoursLeft).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutesLeft).padStart(2, "0");
  document.getElementById("seconds").textContent = String(secondsLeft).padStart(2, "0");
}

// Real seconds countdown from "random" start
let timerSeconds = Math.floor(Math.random() * 86400 * 30) + 86400 * 5;

function realCountdown() {
  timerSeconds = Math.max(0, timerSeconds - 1);
  const days = Math.floor(timerSeconds / 86400);
  const hours = Math.floor((timerSeconds % 86400) / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(realCountdown, 1000);
realCountdown();

// ===== MUSIC =====
let musicPlaying = false;
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Музыка";
    musicPlaying = false;
  } else {
    bgMusic.play().catch(() => {
      musicBtn.textContent = "🔇 Нет аудио";
    });
    musicBtn.textContent = "🔊 Стоп";
    musicPlaying = true;
  }
}

// ===== RANDOM AUTO-SCREAMER =====
let screamCount = 0;
function autoScreamer() {
  if (screamCount < 3) {
    const delay = 8000 + screamCount * 15000 + Math.random() * 5000;
    setTimeout(() => {
      const idx = Math.floor(Math.random() * screamers.length);
      triggerScreamer(idx);
      screamCount++;
      autoScreamer();
    }, delay);
  }
}

// Start auto-screamer after 8 seconds
autoScreamer();

// ===== STAGGERED CARD ANIMATIONS =====
const cards = document.querySelectorAll(".wish-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "scale(1)";
      }, i * 100);
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => {
  card.style.opacity = "0";
  card.style.transform = "scale(0)";
  card.style.transition = "opacity 0.5s, transform 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)";
  observer.observe(card);
});

// ===== INITIAL CONFETTI BURST =====
setTimeout(() => {
  launchConfetti();
}, 500);

setTimeout(() => {
  launchConfetti();
}, 2000);

// ===== RAINBOW CURSOR TRAIL =====
document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.7) {
    const spark = document.createElement("div");
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: hsl(${Math.random() * 360}, 100%, 60%);
      pointer-events: none;
      z-index: 9998;
      animation: sparkFade 0.6s ease forwards;
    `;
    document.body.appendChild(spark);

    // Add keyframe dynamically
    const style = document.createElement("style");
    style.textContent = `
      @keyframes sparkFade {
        from { transform: scale(1); opacity: 1; }
        to   { transform: scale(0) translateY(-20px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      spark.remove();
      style.remove();
    }, 600);
  }
});

console.log("🎉 С Днём Рождения, Алексей! Не убегай от повестки 😂");
