const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// Trail follows with lerp
function animateTrail() {
  const cursorX = parseFloat(cursor.style.left) || 0;
  const cursorY = parseFloat(cursor.style.top)  || 0;
  trailX += (cursorX - trailX) * 0.12;
  trailY += (cursorY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button, .project-card, .skill-tags span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '16px';
    cursor.style.height = '16px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
  });
});

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });


const phrases = [
  'CS student @ Manchester',
  'Full-stack developer',
  'MoD Cyber Bursary holder',
  'Hackathon builder',
  'Looking for internships',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const twEl    = document.getElementById('typewriter');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    twEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 65);
  } else {
    twEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 300);
      return;
    }
    setTimeout(typeLoop, 35);
  }
}
typeLoop();

const revealEls = document.querySelectorAll(
  '.project-card, .about-grid, .timeline-item, .contact-inner, .hero-tag, .stat'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children of grids
      const delay = entry.target.closest('.projects-grid') || entry.target.closest('.timeline')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 120
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

const termLines = document.querySelectorAll('.t-line');
termLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateX(-8px)';
  line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateX(0)';
  }, 800 + i * 120);
});


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));