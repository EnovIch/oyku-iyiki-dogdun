'use strict';
// Öykü'nün küçük sürpriz dünyası ♡ — tüm özellikler internet olmadan çalışır.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bölümlerin nazikçe görünmesi
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.11, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(el => observer.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

// Sevimli uçuşan kalpler / konfeti
const shapes = ['♥', '♡', '✦', '✿', '●'];
const colors = ['#ed819a', '#ffc68f', '#c7a9f2', '#e493ad', '#a9d8c9'];
function confetti(count = 42) {
  if (reduceMotion) return;
  const layer = $('#confettiLayer');
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.setProperty('--duration', `${3 + Math.random() * 2.5}s`);
    particle.style.setProperty('--drift', `${-190 + Math.random() * 380}px`);
    particle.style.setProperty('--spin', `${-720 + Math.random() * 1440}deg`);
    particle.style.setProperty('--size', `${14 + Math.random() * 20}px`);
    particle.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    particle.style.animationDelay = `${Math.random() * .65}s`;
    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}
let toastTimer;
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// Modal: kartlar ve gizli hediye
let lastFocused = null;
function openModal(title, body, decor = '💗') {
  lastFocused = document.activeElement;
  $('#modalTitle').textContent = title;
  $('#modalBody').textContent = body;
  $('#modalDecor').textContent = decor;
  $('#modalOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}
function closeModal() {
  $('#modalOverlay').hidden = true;
  document.body.style.overflow = '';
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}
$('#modalClose').addEventListener('click', closeModal);
$('#modalOkay').addEventListener('click', () => { closeModal(); confetti(26); });
$('#modalOverlay').addEventListener('click', (event) => {
  if (event.target.id === 'modalOverlay') closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#modalOverlay').hidden) closeModal();
  if (event.key === 'Tab' && !$('#modalOverlay').hidden) {
    const controls = [$('#modalClose'), $('#modalOkay')];
    if (event.shiftKey && document.activeElement === controls[0]) {
      event.preventDefault(); controls[1].focus();
    } else if (!event.shiftKey && document.activeElement === controls[1]) {
      event.preventDefault(); controls[0].focus();
    }
  }
});
$$('.memory-card').forEach((card) => card.addEventListener('click', () => {
  openModal('Sen benim en güzel iyi kim’sin! ♡', card.dataset.message, card.querySelector('.memory-icon').textContent);
  confetti(18);
}));

$('#heartBtn').addEventListener('click', () => {
  confetti(55);
  toast('Öykü’ye tam 1000 tane kalp yollandı! 💗💗💗');
});
$('#startSurprise').addEventListener('click', () => {
  $('#mektup').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  confetti(32);
  toast('Kalbimin içine hoş geldin Öykü! 💌');
});

// Zarftaki mektup
let letterOpen = false;
$('#envelopeBtn').addEventListener('click', () => {
  letterOpen = !letterOpen;
  $('#envelopeBtn').classList.toggle('open', letterOpen);
  $('#envelopeBtn').setAttribute('aria-expanded', String(letterOpen));
  $('#letterPaper').hidden = !letterOpen;
  $('#letterInstruction').textContent = letterOpen ? 'Bu satırların hepsi senin için yazıldı ♡' : 'Mektuba dokun, kalbimi oku ♡';
  if (letterOpen) {
    confetti(44);
    setTimeout(() => $('#letterPaper').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }), 400);
  }
});

// Pasta mumları
let candlesBlown = false;
$('#blowBtn').addEventListener('click', () => {
  if (!candlesBlown) {
    candlesBlown = true;
    $('.cake-art').classList.add('blown');
    $('#cakeFeedback').textContent = 'Dileğin gerçek olsun, güzel kalplim! ✨💖';
    $('#blowBtn').textContent = '💞 Bir daha mum yak';
    $('.cake-art').setAttribute('aria-label', 'Mumları söndürülmüş pembe kremalı doğum günü pastası');
    confetti(95);
    toast('Yaşasın! İyi ki doğdun Öyküüü! 🎉');
  } else {
    candlesBlown = false;
    $('.cake-art').classList.remove('blown');
    $('#cakeFeedback').textContent = 'Bir dilek daha tutabilirsin... 💫';
    $('#blowBtn').textContent = '🕯️ Mumları üfle!';
    $('.cake-art').setAttribute('aria-label', 'Üç yanan mumlu, pembe kremalı doğum günü pastası');
  }
});

$('#giftBtn').addEventListener('click', () => {
  confetti(115);
  openModal('Asıl hediyem bir söz! 🎀', 'Ne olursa olsun, en güzel günlerimiz henüz gelmedi. Yeni yaşında elini tutup daha çok anı biriktirmek, daha çok gülmek, daha çok “iyi ki” demek istiyorum.\n\nDoğum günün kutlu olsun, bir tanem. Seni çok seviyorum! ♡', '🎁');
});

// Harici ses dosyası gerekmeden çalışan küçük doğum günü melodisi (Web Audio).
let audioContext = null;
let musicOn = false;
let musicTimer = null;
let melodyOffset = 0;
const melody = [
  [392,.3],[392,.18],[440,.55],[392,.55],[523.25,.55],[493.88,.95],
  [392,.3],[392,.18],[440,.55],[392,.55],[587.33,.55],[523.25,.95],
  [392,.3],[392,.18],[784,.55],[659.25,.55],[523.25,.55],[493.88,.6],[440,.9],
  [698.46,.3],[698.46,.18],[659.25,.55],[523.25,.55],[587.33,.55],[523.25,1.1]
];
function playNote(freq, startTime, duration) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(.095, startTime + .018);
  gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration * .94);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}
function scheduleMelody() {
  if (!musicOn || !audioContext) return;
  // Tüm melodiyi iki tekrarda bir yeniden planla.
  let time = audioContext.currentTime + .1;
  for (const [freq, units] of melody) {
    const duration = units * .47;
    playNote(freq, time, duration * .93);
    time += duration;
  }
  melodyOffset = (time - audioContext.currentTime) * 1000;
  musicTimer = setTimeout(scheduleMelody, melodyOffset + 450);
}
$('#musicBtn').addEventListener('click', async () => {
  const btn = $('#musicBtn');
  if (!musicOn) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) { toast('Bu tarayıcı ses çalmayı desteklemiyor. ♡'); return; }
    try {
      if (audioContext) { await audioContext.close(); }
      audioContext = new Context();
      await audioContext.resume();
    } catch (error) { toast('Ses açılmadı. Tarayıcı izinlerini kontrol et.'); return; }
    musicOn = true;
    btn.setAttribute('aria-pressed', 'true');
    $('#musicText').textContent = 'Müziği kapat';
    scheduleMelody();
  } else {
    musicOn = false;
    clearTimeout(musicTimer);
    if (audioContext) { await audioContext.close(); audioContext = null; }
    btn.setAttribute('aria-pressed', 'false');
    $('#musicText').textContent = 'Müziği aç';
  }
});
