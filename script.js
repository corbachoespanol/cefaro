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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animation for toggle lines
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') 
                ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') 
                ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') 
                ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });

        // Close nav on click
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    /* -------------------------------------------------------------
       5. ACTIVE NAV NAVIGATION ON SCROLL
    ------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    function highlightNav() {
        let scrollPosition = window.scrollY + 120; // offset for sticky header

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

});
