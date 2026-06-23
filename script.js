// ===========================
// LENIS SMOOTH SCROLL + GSAP
// ===========================

let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// ===========================
// SCROLL PROGRESS BAR
// ===========================

function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
        }
    });
}

// ===========================
// MAIN INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');

    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback');
        const greeting = document.querySelector('.greeting');
        const name = document.querySelector('.name');
        const tagline = document.querySelector('.tagline');
        if (greeting) { greeting.style.opacity = '1'; greeting.style.transform = 'translateY(0)'; }
        if (name) { name.style.opacity = '1'; name.style.transform = 'translateY(0)'; }
        if (tagline) { tagline.style.opacity = '1'; tagline.style.transform = 'translateY(0)'; }
        setTimeout(() => typeTagline(), 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;

    // Init Lenis smooth scroll (desktop only for performance)
    if (!isMobile && typeof Lenis !== 'undefined') {
        initLenis();
    }

    // Init scroll progress bar
    initScrollProgress();

    // Performance config
    if (isMobile) {
        gsap.config({ force3D: true });
        ScrollTrigger.config({ limitCallbacks: true });
    }

    // ===========================
    // HERO SECTION ANIMATIONS
    // ===========================

    const heroTl = gsap.timeline();

    // Character-by-character name reveal (professional clip-mask style)
    const charWraps = document.querySelectorAll('.char-wrap');
    if (charWraps.length > 0) {
        gsap.set(charWraps, { yPercent: 110, opacity: 0 });
    }

    gsap.set('.greeting', { opacity: 0, y: 20 });
    gsap.set('.tagline', { opacity: 0, y: 20 });
    gsap.set('.npx-hint', { opacity: 0, y: 15, scale: 0.97 });
    gsap.set('.scroll-indicator', { opacity: 0, y: 15 });

    heroTl
        .to('.greeting', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        .to(charWraps, {
            yPercent: 0, opacity: 1,
            duration: 0.8, stagger: 0.035, ease: 'power4.out'
        }, '-=0.5')
        .to('.tagline', {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            onComplete: () => typeTagline()
        }, '-=0.3')
        .to('.npx-hint', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    // Hero parallax on scroll — content moves up, bg layer stays
    if (!isMobile) {
        gsap.to('.hero-content', {
            yPercent: -50,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });

        gsap.to('.hero-bg-layer', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });

        // Hide scroll indicator on scroll
        gsap.to('.scroll-indicator', {
            opacity: 0,
            y: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '20% top',
                scrub: 1,
            }
        });
    }

    // Floating hero animation
    gsap.to('.hero-content', {
        y: isMobile ? '+=5' : '+=10',
        duration: isMobile ? 4 : 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
    });

    // Mouse parallax (desktop only)
    if (!isMobile && !isTouch) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            gsap.to('.hero-content', { x: mouseX * 15, y: mouseY * 15, duration: 1.2, ease: 'power2.out' });
            gsap.to('.about-content', { x: mouseX * 10, y: mouseY * 10, duration: 1.5, ease: 'power2.out' });
        });
    }

    // ===========================
    // SECTION REVEAL ANIMATIONS
    // ===========================

    // Reusable section title reveal
    document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
        if (el.closest('.hero')) return; // Skip hero elements (handled above)

        gsap.set(el, { opacity: 0, y: 60 });
        gsap.to(el, {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                end: 'top 60%',
                scrub: isMobile ? false : 1,
                toggleActions: isMobile ? 'play none none none' : undefined,
            }
        });
    });

    // Intersection Observer fallback
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: isMobile ? 0.05 : 0.1, rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px' });
    document.querySelectorAll('section').forEach(s => { if (s) observer.observe(s); });

    // Init all sections
    initAboutSection();
    initSkillsSection();
    initProjectsSection();
    initExperienceSection();
    initContactSection();

    ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: isMobile ? 150 : 100,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        ignoreMobileResize: true,
    });

    if (isMobile) {
        window.addEventListener('orientationchange', () => setTimeout(() => ScrollTrigger.refresh(), 500));
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), isMobile ? 300 : 100);
    });

    setTimeout(() => ScrollTrigger.refresh(), 100);
    initThemeToggle();
});

// ===========================
// TYPING ANIMATION
// ===========================

function typeTagline() {
    const roles = ["Backend Developer", "Tech Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    const taglineElement = document.getElementById('tagline-text');
    if (!taglineElement) return;
    taglineElement.textContent = '';

    function type() {
        if (charIndex < roles[roleIndex].length) {
            taglineElement.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            taglineElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 500);
        }
    }

    type();
}

// ===========================
// ABOUT SECTION
// ===========================

function initAboutSection() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.about-text-content p', { opacity: 0, y: 40 });

    // Parallax text scrub for about detail
    gsap.to('.about-text-content p', {
        opacity: 1, y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            end: 'center center',
            scrub: isMobile ? false : 1.5,
            toggleActions: isMobile ? 'play none none reverse' : undefined,
        }
    });
}

// ===========================
// SKILLS SECTION
// ===========================

function initSkillsSection() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.skill-card', { opacity: 0, y: 60, scale: 0.9 });

    gsap.to('.skill-card', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 75%',
            end: 'center center',
            scrub: isMobile ? false : 1,
            toggleActions: isMobile ? 'play none none none' : undefined,
        }
    });
}

// ===========================
// PROJECTS SECTION
// ===========================

function initProjectsSection() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.project-item', { opacity: 0, y: 80 });
    gsap.set('.project-info, .project-name, .project-desc, .project-tech, .tech-tag, .view-code-btn', {
        opacity: 1, visibility: 'visible'
    });

    // Each project item scrubs in on scroll
    document.querySelectorAll('.project-item').forEach((item, index) => {
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.fromTo(item,
            { opacity: 0, y: 80, x: isMobile ? 0 : direction * 60 },
            {
                opacity: 1, y: 0, x: 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    end: 'top 50%',
                    scrub: isMobile ? false : 1.2,
                    toggleActions: isMobile ? 'play none none none' : undefined,
                }
            }
        );
    });

    // Fallback visibility
    setTimeout(() => {
        document.querySelectorAll('.project-item').forEach((item, index) => {
            if (getComputedStyle(item).opacity === '0') {
                gsap.to(item, { opacity: 1, y: 0, x: 0, duration: 0.3, ease: 'power2.out', delay: index * 0.1 });
            }
        });
    }, 2000);

    // Video lazy play/pause
    const videos = document.querySelectorAll('.project-video');
    videos.forEach(video => {
        ScrollTrigger.create({
            trigger: video,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => video.play(),
            onEnterBack: () => video.play(),
            onLeave: () => video.pause(),
            onLeaveBack: () => video.pause(),
        });
    });

    // Hover effects
    document.querySelectorAll('.project-item').forEach(item => {
        const media = item.querySelector('.project-media');
        const info = item.querySelector('.project-info');
        item.addEventListener('mouseenter', () => {
            gsap.to(media, { y: -5, duration: 0.3, ease: 'power2.out' });
            gsap.to(info, { y: -5, duration: 0.3, ease: 'power2.out' });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(media, { y: 0, duration: 0.3, ease: 'power2.out' });
            gsap.to(info, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
}

// ===========================
// EXPERIENCE SECTION
// ===========================

function initExperienceSection() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.timeline-line', { scaleY: 0, transformOrigin: 'top center' });
    gsap.set('.timeline-item', { opacity: 0, y: 60 });

    // Timeline line grows with scroll
    gsap.to('.timeline-line', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
        }
    });

    // Timeline items scrub in
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        gsap.to(item, {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 55%',
                scrub: isMobile ? false : 1,
                toggleActions: isMobile ? 'play none none reverse' : undefined,
            }
        });
    });

    // Experience card hover
    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' }));
    });

    // Stat counter animation
    document.querySelectorAll('.stat-number').forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        if (numericValue) {
            gsap.set(stat, { textContent: '0' });
            gsap.to(stat, {
                textContent: numericValue,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: { trigger: stat, start: 'top 80%', toggleActions: 'play none none reverse' },
                onUpdate: function() {
                    const v = Math.round(this.targets()[0].textContent);
                    stat.textContent = finalValue.includes('+') ? v + '+' : finalValue.includes('%') ? v + '%' : v;
                }
            });
        }
    });
}

// ===========================
// CONTACT SECTION
// ===========================

function initContactSection() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.social-icon-link', { opacity: 0, y: 30, scale: 0.8 });

    gsap.to('.social-icon-link', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 85%',
            end: 'top 50%',
            scrub: isMobile ? false : 1,
            toggleActions: isMobile ? 'play none none none' : undefined,
        }
    });
}

// ===========================
// CERTIFICATION SLIDER
// ===========================

function initCertificationSlider() {
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slider-dot');
    const slides = document.querySelectorAll('.certification-slide');
    const sliderContainer = document.querySelector('.certifications-slider');

    if (!track || !prevBtn || !nextBtn || !sliderContainer || dots.length === 0 || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    track.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => { slide.style.width = `${100 / totalSlides}%`; });

    let autoPlayInterval;
    const autoPlayDelay = 3000;

    function updateSlider() {
        const offset = -currentSlide * (100 / totalSlides);
        gsap.to(track, { x: `${offset}%`, duration: 1.5, ease: 'power3.inOut', force3D: true });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));

        const overlay = slides[currentSlide].querySelector('.certification-overlay');
        if (overlay) {
            gsap.fromTo(overlay, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
        }
    }

    function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; updateSlider(); }
    function prevSlide() { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlider(); }
    function goToSlide(i) { currentSlide = i; updateSlider(); }
    function startAutoPlay() { stopAutoPlay(); autoPlayInterval = setInterval(nextSlide, autoPlayDelay); }
    function stopAutoPlay() { clearInterval(autoPlayInterval); }

    prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); }));

    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch/swipe
    let startX = 0, startY = 0, isDragging = false;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; isDragging = true; stopAutoPlay(); }, { passive: true });
    track.addEventListener('touchmove', () => {}, { passive: false });
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            diffX > 0 ? nextSlide() : prevSlide();
        }
        isDragging = false;
        startAutoPlay();
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        const rect = document.querySelector('.certifications').getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
            else if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
        }
    });

    updateSlider();

    ScrollTrigger.create({
        trigger: '.certifications',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: startAutoPlay,
        onLeave: stopAutoPlay,
        onEnterBack: startAutoPlay,
        onLeaveBack: stopAutoPlay,
    });
}

// ===========================
// CERTIFICATION ANIMATIONS
// ===========================

function initCertificationAnimations() {
    const isMobile = window.innerWidth <= 768;

    gsap.set('.certifications-slider', { y: 80, opacity: 0, scale: 0.95 });
    gsap.set('.slider-btn', { scale: 0, opacity: 0 });
    gsap.set('.slider-dots', { y: 30, opacity: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.certifications',
            start: 'top 80%',
            end: 'top 30%',
            scrub: isMobile ? false : 1,
            toggleActions: isMobile ? 'play none none none' : undefined,
        }
    });

    tl.to('.certifications-slider', { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' })
      .to('.slider-btn', { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 }, '-=0.3')
      .to('.slider-dots', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');
}

// ===========================
// THEME TOGGLE
// ===========================

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        html.classList.add('light-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-theme');
            html.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            html.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ===========================
// INVADR SLIDER
// ===========================

(function () {
    function initInvadrSlider() {
        const slides = document.querySelector('.invadr-slides');
        if (!slides) return;
        const images = slides.querySelectorAll('.invadr-slide');
        if (images.length < 2) return;
        let current = 0;
        setInterval(() => {
            current = (current + 1) % images.length;
            slides.style.transform = `translateX(-${current * 100}%)`;
        }, 2500);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInvadrSlider);
    } else {
        initInvadrSlider();
    }
})();

// ===========================
// GLOWING BALL CURSOR
// ===========================

document.addEventListener('mousemove', (e) => {
    const ball = document.querySelector('.glowing-ball');
    if (ball) {
        ball.style.left = e.clientX + 'px';
        ball.style.top = e.clientY + 'px';
    }
});

// ===========================
// DEFERRED INIT
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initCertificationSlider();
        initCertificationAnimations();
    }, 500);
});
