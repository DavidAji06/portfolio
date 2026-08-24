const reticle = document.getElementById('reticle');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (reticle && finePointer) {
  let rx = window.innerWidth / 2;
  let ry = window.innerHeight / 2;
  let tx = rx, ty = ry;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  const drawReticle = () => {
    rx += (tx - rx) * 0.28;
    ry += (ty - ry) * 0.28;
    reticle.style.left = rx + 'px';
    reticle.style.top  = ry + 'px';
    requestAnimationFrame(drawReticle);
  };
  drawReticle();

  // Lock onto interactive targets
  const targets = 'a, button, .entry, .spec-row, .ledger-row';
  document.querySelectorAll(targets).forEach((el) => {
    el.addEventListener('mouseenter', () => reticle.classList.add('locked'));
    el.addEventListener('mouseleave', () => reticle.classList.remove('locked'));
  });
}

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('compact', window.scrollY > 60);
}, { passive: true });


const phrases = [
  'CS student @ Manchester',
  'Full-stack developer',
  'MoD Cyber Bursary holder',
  'Hackathon builder',
  'Looking for internships',
];

const twEl = document.getElementById('typewriter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (twEl && reduceMotion) {
  twEl.textContent = phrases[0];
} else if (twEl) {
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const typeLoop = () => {
    const current = phrases[phraseIdx];

    if (!deleting) {
      twEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 62);
    } else {
      twEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 320);
        return;
      }
      setTimeout(typeLoop, 28);
    }
  };
  typeLoop();
}

const riseEls = document.querySelectorAll(
  '.entry, .ledger-row, .spec-row, .ro-cell, .contact-lede, .contact-body, .contact-email, .crow, .about-prose > p, .titleblock'
);
riseEls.forEach((el) => el.classList.add('rise'));

const riseObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.children);
    const delay = Math.min(siblings.indexOf(entry.target), 6) * 80;
    setTimeout(() => entry.target.classList.add('shown'), delay);
    riseObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

riseEls.forEach((el) => riseObserver.observe(el));

const headObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('plotted');
    headObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.head').forEach((h) => headObserver.observe(h));

const termLines = document.querySelectorAll('.t-line');
if (!reduceMotion) {
  termLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-6px)';
    line.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'none';
    }, 700 + i * 110);
  });
}

const sheets = [
  { id: 'home',       num: '00', name: 'Cover' },
  { id: 'about',      num: '01', name: 'About' },
  { id: 'projects',   num: '02', name: 'Projects' },
  { id: 'experience', num: '03', name: 'Experience' },
  { id: 'contact',    num: '04', name: 'Contact' },
];

const siNum = document.getElementById('si-num');
const siName = document.getElementById('si-name');
const navLinks = document.querySelectorAll('.nav-links a');

const setSheet = (id) => {
  const sheet = sheets.find((s) => s.id === id);
  if (!sheet) return;
  siNum.textContent = sheet.num;
  siName.textContent = sheet.name;
  navLinks.forEach((link) => {
    link.classList.toggle('current', link.getAttribute('href') === '#' + id);
  });
};

const sheetObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((e) => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setSheet(visible.target.id);
}, { threshold: [0.15, 0.4, 0.7], rootMargin: '-20% 0px -35% 0px' });

sheets.forEach((s) => {
  const el = document.getElementById(s.id);
  if (el) sheetObserver.observe(el);
});