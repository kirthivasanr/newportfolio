// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing hero section...');
    
    // Check if GSAP is available, if not, show elements without animation
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback');
        // Fallback: Show elements immediately if GSAP is not loaded
        const greeting = document.querySelector('.greeting');
        const name = document.querySelector('.name');
        const tagline = document.querySelector('.tagline');
        
        if (greeting) {
            greeting.style.opacity = '1';
            greeting.style.transform = 'translateY(0)';
        }
        if (name) {
            name.style.opacity = '1';
            name.style.transform = 'translateY(0)';
        }
        if (tagline) {
            tagline.style.opacity = '1';
            tagline.style.transform = 'translateY(0)';
        }
        
        // Start typing animation after a short delay
        setTimeout(() => {
            typeTagline();
        }, 100);
        return;
    }

    console.log('GSAP loaded successfully, starting animations...');

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Define animation durations
    const animDuration = {
        fast: 0.5,
        medium: 0.8,
        slow: 1.2
    };
    
    // Mobile detection and optimization
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;
    
    // Performance optimization for mobile
    if (isMobile) {
        // Reduce animation complexity on mobile
        gsap.config({ force3D: true, trialWarn: false });
        ScrollTrigger.config({ limitCallbacks: true });
    }
    
    // GSAP Timeline for coordinated animations
    const tl = gsap.timeline();
    
    // Hero Section - Set initial states and animate
    gsap.set('.greeting', { opacity: 0, y: 20 });
    gsap.set('.name', { opacity: 0, y: 20 });
    gsap.set('.tagline', { opacity: 0, y: 20 });

    tl.to('.greeting', {
        opacity: 1, 
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    .to('.name', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6")
    .to('.tagline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => typeTagline()
    }, "-=0.6");

    // Typing animation function
    function typeTagline() {
        const roles = ["Backend Developer" , "Tech Enthusiast"];
        let roleIndex = 0;
        let charIndex = 0;
        const taglineElement = document.getElementById('tagline-text');
        
        if (!taglineElement) {
            console.warn('Tagline element not found');
            return;
        }

        // Clear any existing content
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

    // About Section - Responsive animations
    gsap.set('.about', { y: isMobile ? 50 : 100, opacity: 0 });
    gsap.set('.about-title', { y: isMobile ? 30 : 50, opacity: 0 });
    gsap.set('.about-intro', { y: isMobile ? 20 : 30, opacity: 0 });
    gsap.set('.about-detail', { y: isMobile ? 20 : 30, opacity: 0 });
    
    // Animate section into view
    gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            start: "top 90%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.about', {
        y: 0,
        opacity: 1,
        duration: animDuration.medium,
        ease: "power3.out"
    })
    .to('.about-title', {
        y: 0,
        opacity: 1,
        duration: animDuration.fast,
        ease: "power2.out"
    }, "-=0.8")
    .to('.about-intro', {
        y: 0,
        opacity: 1,
        duration: animDuration.fast * 0.8,
        ease: "power2.out"
    }, "-=0.6")
    .to('.about-detail', {
        y: 0,
        opacity: 1,
        duration: animDuration.fast * 0.6,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4");
      // Add mouse movement parallax effect for modern touch (disabled on mobile for performance)
    if (!isMobile && !isTouch) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
              gsap.to('.hero-content', {
                x: mouseX * 15,
                y: mouseY * 15,
                duration: 1.2,
                ease: "power2.out"
            });
            
            // Subtle parallax for about section too
            gsap.to('.about-content', {
                x: mouseX * 10,
                y: mouseY * 10,
                duration: 1.5,
                ease: "power2.out"
            });
        });
    }
    
    // Add floating animation to the hero content (reduced on mobile)
    gsap.to('.hero-content', {
        y: isMobile ? '+=5' : '+=10',
        duration: isMobile ? 4 : 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });
    
    // Intersection Observer for performance optimization
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
    };
    
    // Create observer for future animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });
    
    // Initialize Sections
    initAboutSection();
    initSkillsSection();
    initProjectsSection();
    initExperienceSection();
    initContactSection();

    // Optimize ScrollTrigger performance for faster animations
    ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: isMobile ? 150 : 100,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        ignoreMobileResize: true,
        anticipatePin: 1
    });
    
    // Add orientation change handler for mobile
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    }
    
    // Add window resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, isMobile ? 300 : 100);
    });
    
    // Refresh ScrollTrigger after a short delay to ensure proper positioning
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
    
    // Initialize theme toggle
    initThemeToggle();
});

// About Section Implementation
function initAboutSection() {
    const isMobile = window.innerWidth <= 768;
    gsap.set('.about-title', { opacity: 0, y: 50 });
    gsap.set('.about-text-content p', { opacity: 0, y: 30 });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.about-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    })
    .to('.about-text-content p', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.7");
}

// Skills Section Implementation
function initSkillsSection() {
    // GSAP animations for skills section
    gsap.set('.skills-title', { opacity: 0, y: 50 });
    gsap.set('.skill-card', { opacity: 0, y: 50 });
    
    // Animate skills section on scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: ".skills",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.skills-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    })
    .to('.skill-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.5");
}

// Initialize Projects Section
function initProjectsSection() {
    // Mobile detection for optimized performance
    const isMobile = window.innerWidth <= 768;
    
    // GSAP animations for projects section - reduced initial transform for smoother animation
    gsap.set('.projects-title', { opacity: 0, y: 30 });
    gsap.set('.project-item', { opacity: 0, y: 30 });
    
    // Ensure project content is always visible (fallback)
    gsap.set('.project-info, .project-name, .project-desc, .project-tech, .tech-tag, .view-code-btn', { 
        opacity: 1, 
        visibility: 'visible' 
    });
      // Animate projects title - faster animation
    gsap.timeline({
        scrollTrigger: {
            trigger: ".projects",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.projects-title', {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.3 : 0.4,
        ease: "power2.out"
    });// Animate each project item individually as they come into view
    document.querySelectorAll('.project-item').forEach((item, index) => {
        // Configuration: Set to true if you want items to fade when out of view, false to keep them visible once shown
        const fadeWhenOutOfView = false;
        
        // Create a fast, reliable trigger that doesn't cause disappearing
        gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play none none none", // Don't reverse - keep items visible once shown
                scrub: false,
                once: false,
                refreshPriority: 1,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
                onEnter: () => {
                    // Fast appearance animation
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.2 : 0.25,
                        ease: "power2.out",
                        force3D: true,
                        overwrite: true
                    });
                },
                onLeave: () => {
                    // Only fade if configured to do so
                    if (fadeWhenOutOfView) {
                        gsap.to(item, {
                            opacity: 0.2,
                            duration: isMobile ? 0.1 : 0.15,
                            ease: "power2.out",
                            overwrite: true
                        });
                    }
                },
                onEnterBack: () => {
                    // Quick reappearance when scrolling back up
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.1 : 0.15,
                        ease: "power2.out",
                        force3D: true,
                        overwrite: true
                    });
                },
                onLeaveBack: () => {
                    // Only fade if configured to do so
                    if (fadeWhenOutOfView) {
                        gsap.to(item, {
                            opacity: 0.2,
                            duration: isMobile ? 0.1 : 0.15,
                            ease: "power2.out",
                            overwrite: true
                        });
                    }
                }
            }
        });
    });
    
    // Backup mechanism: Ensure all project items become visible after a delay if ScrollTrigger fails
    setTimeout(() => {
        document.querySelectorAll('.project-item').forEach((item, index) => {
            if (getComputedStyle(item).opacity === '0') {
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    delay: index * 0.1
                });
            }
        });
    }, 2000); // 2 second fallback delay
      // Lazy load project videos on scroll to improve performance
    const videos = document.querySelectorAll(".project-video");
    videos.forEach(video => {
        ScrollTrigger.create({
            trigger: video,
            start: "top center",
            end: "bottom center",
            onEnter: () => video.play(),
            onEnterBack: () => video.play(),
            onLeave: () => video.pause(),
            onLeaveBack: () => video.pause(),
        });
    });

    // Add hover effects for project items
    document.querySelectorAll('.project-item').forEach(item => {
        const media = item.querySelector('.project-media');
        const info = item.querySelector('.project-info');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(media, {
                y: -5,
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(info, {
                y: -5,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(media, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(info, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Initialize Experience Section
function initExperienceSection() {
    // GSAP animations for experience section
    gsap.set('.experience-title', { opacity: 0, y: 50 });
    gsap.set('.timeline-line', { scaleY: 0, transformOrigin: "top center" });
    gsap.set('.timeline-item', { opacity: 0, y: 50 });
    
    // Animate experience title and timeline
    gsap.timeline({
        scrollTrigger: {
            trigger: ".experience",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.experience-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    })
    .to('.timeline-line', {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out"
    }, "-=0.5");
    
    // Animate timeline items individually
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "top 15%",
                toggleActions: "play none none reverse"
            }
        })
        .to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1
        });
    });
    
    // Add hover effects for experience cards
    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Add number counting animation for stats
    document.querySelectorAll('.stat-number').forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (numericValue) {
            gsap.set(stat, { textContent: '0' });
            
            gsap.timeline({
                scrollTrigger: {
                    trigger: stat,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
            .to(stat, {
                textContent: numericValue,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    const currentValue = Math.round(this.targets()[0].textContent);
                    if (finalValue.includes('+')) {
                        stat.textContent = currentValue + '+';
                    } else if (finalValue.includes('%')) {
                        stat.textContent = currentValue + '%';
                    } else {
                        stat.textContent = currentValue;
                    }
                }
            });
        }
    });
}

// Initialize Contact Section
function initContactSection() {
    // GSAP animations for contact section
    gsap.set('.contact-title', { opacity: 0, y: 50 });
    gsap.set('.social-card', { opacity: 0, y: 50 });
    
    // Animate contact title
    gsap.timeline({
        scrollTrigger: {
            trigger: ".contact",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.contact-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });
    
    // Animate social cards with stagger effect
    gsap.timeline({
        scrollTrigger: {
            trigger: ".social-grid",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.social-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });
    
    // Add enhanced hover effects for social cards
    document.querySelectorAll('.social-card').forEach(card => {
        const icon = card.querySelector('.social-icon');
        const btn = card.querySelector('.social-btn');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(icon, {
                rotationY: 15,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(icon, {
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Button click animation
        btn.addEventListener('click', function(e) {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this, {
                        scale: 1,
                        duration: 0.1,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
    
    // Add floating animation to social icons
    document.querySelectorAll('.social-icon').forEach((icon, index) => {
        gsap.to(icon, {
            y: '+=5',
            duration: 2 + (index * 0.5),
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2
        });
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

    // Dynamically set track and slide widths for robustness
    track.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => {
        slide.style.width = `${100 / totalSlides}%`;
    });
    
    // Auto-play settings
    let autoPlayInterval;
    const autoPlayDelay = 3000; // 3 seconds
    
    function updateSlider() {
        // Calculate offset dynamically based on number of slides
        const offset = -currentSlide * (100 / totalSlides);
        
        gsap.to(track, {
            x: `${offset}%`,
            duration: 1.5, // Slower, smoother slide duration
            ease: "power3.inOut", // Smoother easing for a more fluid motion
            force3D: true
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update active slide for overlay effects
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Animate current slide overlay
        const currentSlideElement = slides[currentSlide];
        const overlay = currentSlideElement.querySelector('.certification-overlay');
        
        if (overlay) {
            gsap.fromTo(overlay, 
                { 
                    opacity: 0,
                    y: 30
                },
                { 
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.5 // Delay to start after slide transition
                }
            );
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }
    
    function startAutoPlay() {
        stopAutoPlay(); // Prevent multiple intervals
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Restart autoplay
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoPlay();
        });
    });
    
    // Pause auto-play on hover
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // This is intentionally left empty to allow default scroll behavior
    }, { passive: false });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        startAutoPlay();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const sliderInView = document.querySelector('.certifications').getBoundingClientRect();
        const isInView = sliderInView.top < window.innerHeight && sliderInView.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoPlay();
            }
        }
    });
    
    // Initialize
    updateSlider();

    // Start/Stop autoplay based on visibility
    ScrollTrigger.create({
        trigger: ".certifications",
        start: "top 80%",
        end: "bottom 20%",
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
    // Set initial states
    gsap.set('.certifications-title', { y: 50, opacity: 0 });
    gsap.set('.certifications-slider', { y: 80, opacity: 0, scale: 0.95 });
    gsap.set('.slider-btn', { scale: 0, opacity: 0 });
    gsap.set('.slider-dots', { y: 30, opacity: 0 });
    
    // Main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".certifications",
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
        }
    });
    
    tl.to('.certifications-title', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
    })
    .to('.certifications-slider', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=0.4")
    .to('.slider-btn', {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1
    }, "-=0.3")
    .to('.slider-dots', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.2");
    
    // Individual slide animations when they come into view
    gsap.utils.toArray('.certification-slide').forEach((slide, index) => {
        const image = slide.querySelector('.certification-image img');
        const overlay = slide.querySelector('.certification-overlay');
        const title = overlay.querySelector('h3');
        const issuer = overlay.querySelector('.issuer');
        const date = overlay.querySelector('.date');
        const skills = overlay.querySelectorAll('.cert-skill');
        
        gsap.set([image, title, issuer, date, skills], { opacity: 0, y: 30 });
        
        const slideTl = gsap.timeline({
            scrollTrigger: {
                trigger: slide,
                start: "top 90%",
                end: "top 30%",
                toggleActions: "play none none reverse"
            }
        });
        
        slideTl.to(image, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        })
        .to(title, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4")
        .to([issuer, date], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1
        }, "-=0.3")
        .to(skills, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.05
        }, "-=0.2");
    });
}

// ===========================
// THEME TOGGLE FUNCTIONALITY
// ===========================

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const html = document.documentElement;
    
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        html.classList.add('light-theme');
        themeToggle.checked = true;
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Switch to light mode
            body.classList.add('light-theme');
            html.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark mode
            body.classList.remove('light-theme');
            html.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Add to main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle first
    initThemeToggle();
    
    // ... existing initialization code ...
});

// Invadr image auto-slider
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

// Add to main initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    // Initialize certification features
    setTimeout(() => {
        initCertificationSlider();
        initCertificationAnimations();
    }, 500);
});
