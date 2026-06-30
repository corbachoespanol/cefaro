document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
       1. STARFIELD CANVAS BACKGROUND
    ------------------------------------------------------------- */
    const canvas = document.getElementById('stars-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const numStars = 100;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    direction: Math.random() > 0.5 ? 1 : -1
                });
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';

            stars.forEach(star => {
                // Update opacity for twinkling effect
                star.opacity += star.twinkleSpeed * star.direction;
                if (star.opacity >= 1) {
                    star.opacity = 1;
                    star.direction = -1;
                } else if (star.opacity <= 0.1) {
                    star.opacity = 0.1;
                    star.direction = 1;
                }

                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(animateStars);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateStars();
    }

    /* -------------------------------------------------------------
       2. HERO BEAM ROTATION (Continuous 360deg Sweep)
    ------------------------------------------------------------- */
    const heroBeam = document.getElementById('hero-light-beam');
    let heroAngle = 0;
    
    function rotateHeroBeam() {
        if (heroBeam) {
            heroAngle = (heroAngle + 0.12) % 360;
            heroBeam.style.transform = `rotate(${heroAngle}deg)`;
        }
        requestAnimationFrame(rotateHeroBeam);
    }
    rotateHeroBeam();

    /* -------------------------------------------------------------
       3. INTERACTIVE SCROLL BEAM (Sticky Panel)
    ------------------------------------------------------------- */
    const stickyLighthouse = document.getElementById('sticky-lighthouse');
    const interactiveBeam = document.getElementById('interactive-light-beam');
    const serviceCards = document.querySelectorAll('.service-card');

    // Ensure the SVG allows the beam to render outside its viewBox
    if (stickyLighthouse) {
        stickyLighthouse.style.overflow = 'visible';
    }
    const heroLighthouse = document.getElementById('hero-lighthouse');
    if (heroLighthouse) {
        heroLighthouse.style.overflow = 'visible';
    }

    // Scroll spotting function
    function updateActiveService() {
        if (!interactiveBeam || serviceCards.length === 0) return;

        let activeCard = null;
        let minDistance = Infinity;
        const viewportCenterY = window.innerHeight / 2;

        serviceCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenterY - viewportCenterY);

            // We only consider cards that are within or close to the viewport
            if (distance < minDistance) {
                minDistance = distance;
                activeCard = card;
            }
        });

        if (activeCard) {
            // Remove active state from all cards and add to current one
            serviceCards.forEach(card => card.classList.remove('active'));
            activeCard.classList.add('active');

            // Calculate the angle from the lighthouse bulb to the active card
            // Bulb is at cx=50, cy=35 inside the sticky SVG (which coordinates to 50% width, 17.5% height)
            const lhRect = stickyLighthouse.getBoundingClientRect();
            const bulbX = lhRect.left + lhRect.width * 0.5;
            const bulbY = lhRect.top + lhRect.height * 0.175;

            const cardRect = activeCard.getBoundingClientRect();
            // Point the beam slightly to the left side or center of the card
            const targetX = cardRect.left + cardRect.width * 0.15;
            const targetY = cardRect.top + cardRect.height * 0.5;

            // Calculate angle in degrees
            const dy = targetY - bulbY;
            const dx = targetX - bulbX;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Apply rotation to the beam group
            interactiveBeam.style.transform = `rotate(${angle}deg)`;
        }
    }

    // Run on scroll and on load
    window.addEventListener('scroll', updateActiveService);
    window.addEventListener('resize', updateActiveService);
    updateActiveService();

    /* -------------------------------------------------------------
       4. HEADER SCROLL EFFECT & NAV TOGGLE
    ------------------------------------------------------------- */
    const header = document.querySelector('.main-header');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (scrollIndicator) {
            scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
        }
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    function closeNav() {
        if (!navLinks) return;
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active')
                ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active')
                ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active')
                ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });

        // Close nav on nav-item click or outside click
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', closeNav);
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeNav();
            }
        });
    }

    /* -------------------------------------------------------------
       5. ACTIVE NAV — URL PATHNAME
    ------------------------------------------------------------- */
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        if (href === currentPath) {
            item.classList.add('active');
        } else if (href !== '/' && currentPath.startsWith(href)) {
            item.classList.add('active');
        }
    });

    /* -------------------------------------------------------------
       6. CONTACT FORM — Web3Forms async submit
    ------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const action = contactForm.getAttribute('action');

            if (action.includes('FORMSPREE_TOKEN') || action.includes('access_key=YOUR')) {
                contactForm.innerHTML = '<p class="form-notice"><i class="fa-solid fa-triangle-exclamation"></i> El formulario no está configurado todavía. Escríbenos directamente a <a href="mailto:info@cefaro.net">info@cefaro.net</a></p>';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Enviando…';

            try {
                const data = new FormData(contactForm);
                const res = await fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    contactForm.innerHTML = '<p class="form-success"><i class="fa-solid fa-circle-check"></i> Mensaje enviado. ¡Nos pondremos en contacto muy pronto!</p>';
                } else {
                    throw new Error('server error');
                }
            } catch {
                btn.disabled = false;
                btn.innerHTML = 'Enviar Consulta <i class="fa-solid fa-paper-plane"></i>';
                const err = document.createElement('p');
                err.className = 'form-error';
                err.innerHTML = 'Error al enviar. Escríbenos a <a href="mailto:info@cefaro.net">info@cefaro.net</a>';
                contactForm.appendChild(err);
            }
        });
    }

    /* -------------------------------------------------------------
       7. SCROLL ANIMATIONS — Intersection Observer
    ------------------------------------------------------------- */
    const animatableSelectors = '.catalog-card, .value-card, .process-step, .contact-method-card';
    const animatables = document.querySelectorAll(animatableSelectors);

    if (animatables.length > 0 && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${i * 60}ms`;
                    entry.target.classList.add('animate-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        animatables.forEach(el => {
            el.classList.add('animate-ready');
            io.observe(el);
        });
    }

    /* -------------------------------------------------------------
       8. CATALOG CARD — inject "Solicitar" CTA link
    ------------------------------------------------------------- */
    document.querySelectorAll('.catalog-card').forEach(card => {
        const cta = document.createElement('a');
        cta.href = '/contacto/';
        cta.className = 'catalog-card-cta';
        cta.innerHTML = 'Solicitar presupuesto <i class="fa-solid fa-arrow-right"></i>';
        card.appendChild(cta);
    });

});
