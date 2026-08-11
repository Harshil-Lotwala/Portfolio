const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.classList.toggle('active', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const mobileNavigation = window.matchMedia('(max-width: 900px)');
mobileNavigation.addEventListener('change', event => {
  if (!event.matches) closeMenu();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

const marqueeTrack = document.querySelector('.marquee-track');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let marqueeOffset = 0;
let previousFrame = 0;

function moveMarquee(time) {
  if (!previousFrame) previousFrame = time;
  const elapsed = Math.min(time - previousFrame, 40);
  previousFrame = time;

  if (!reduceMotion.matches) {
    marqueeOffset -= elapsed * 0.055;
    const firstItem = marqueeTrack.firstElementChild;
    const gap = parseFloat(getComputedStyle(marqueeTrack).columnGap) || 0;
    const itemWidth = firstItem.getBoundingClientRect().width + gap;

    if (-marqueeOffset >= itemWidth) {
      marqueeTrack.appendChild(firstItem);
      marqueeOffset += itemWidth;
    }

    marqueeTrack.style.transform = `translate3d(${marqueeOffset}px, 0, 0)`;
  }

  requestAnimationFrame(moveMarquee);
}

requestAnimationFrame(moveMarquee);

reduceMotion.addEventListener('change', event => {
  previousFrame = 0;
  if (event.matches) {
    marqueeOffset = 0;
    marqueeTrack.style.transform = '';
  }
});

const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = 'Sending…';
  formStatus.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    formStatus.textContent = 'Thanks — your message is on its way.';
  } catch (error) {
    formStatus.textContent = 'Something went wrong. Please email me directly instead.';
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});
