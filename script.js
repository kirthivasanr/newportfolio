// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
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
    
    const typingElement = document.getElementById('typing-text');
    const textReveal = document.querySelector('.text-reveal');
    
    // Responsive animation durations
    const animDuration = {
        fast: isMobile ? 0.6 : 1,
        medium: isMobile ? 0.8 : 1.2,
        slow: isMobile ? 1 : 1.5
    };
    
    // Initial setup - hide elements
    gsap.set('.greeting', { opacity: 0, y: isMobile ? 20 : 30 });
    gsap.set('.name', { opacity: 0, y: isMobile ? 30 : 40 });
    gsap.set('#typing-text', { opacity: 0, x: isMobile ? -50 : -100 });

    // Animation sequence with responsive values
    tl.to('.greeting', {
        opacity: 1,
        y: 0,
        duration: animDuration.fast,
        ease: "power2.out"
    })
    .to('.name', {
        opacity: 1,
        y: 0,
        duration: animDuration.fast * 0.8,
        ease: "power2.out"
    }, "-=0.4")
    .to('#typing-text', {
        opacity: 1,
        x: 0,
        duration: animDuration.medium,
        ease: "power3.out",
        onComplete: () => {
            // Reduce bounce effect on mobile for performance
            if (!isMobile) {
                gsap.fromTo('#typing-text', 
                    { scale: 1 },
                    { 
                        scale: 1.03, 
                        duration: 0.3, 
                        ease: "power2.out",
                        yoyo: true,
                        repeat: 1
                    }
                );
            }
        }
    }, "-=0.2");    // About Section - Responsive animations
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
    }, observerOptions);      // Observe hero section
    observer.observe(document.querySelector('.hero'));
    observer.observe(document.querySelector('.about'));
    
    // Initialize 3D Programmer Scene
    init3DProgrammer();
    
    // Initialize Skills Section
    initSkillsSection();
    
    // Initialize Projects Section
    initProjectsSection();
    
    // Initialize Experience Section
    initExperienceSection();
    
    // Initialize Contact Section
    initContactSection();      // Optimize ScrollTrigger performance for faster animations
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
});

// 3D Programmer Scene with Three.js
function init3DProgrammer() {
    const canvas = document.getElementById('programmer-canvas');
    if (!canvas) return;
    
    // Mobile detection for performance optimization
    const isMobile = window.innerWidth <= 768;
    
    // Skip 3D initialization completely on mobile devices
    if (isMobile) {
        console.log('3D Programmer scene skipped on mobile for performance');
        canvas.style.display = 'none';
        return;
    }
    
    // Scene setup with mobile-optimized settings
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Reduce shadow quality on mobile
    if (!isMobile) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    // Lighting with mobile optimization
    const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.8 : 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x06b6d4, isMobile ? 0.8 : 1);
    directionalLight.position.set(5, 10, 5);
    if (!isMobile) {
        directionalLight.castShadow = true;
    }
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x3b82f6, isMobile ? 0.6 : 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);      // Create a detailed 3D programmer character with mobile optimization
    const group = new THREE.Group();
    
    // Reduce geometry complexity on mobile
    const segments = isMobile ? 8 : 12;
    const sphereSegments = isMobile ? 12 : 16;
    
    // Body (hoodie/t-shirt)
    const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.45, 1.2, segments);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1f2937 }); // Dark hoodie
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    if (!isMobile) body.castShadow = true;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, sphereSegments, sphereSegments);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;
    if (!isMobile) head.castShadow = true;
    group.add(head);
    
    // Hair
    const hairGeometry = new THREE.SphereGeometry(0.27, sphereSegments, sphereSegments);
    const hairMaterial = new THREE.MeshPhongMaterial({ color: 0x3d2914 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 0.85;
    hair.scale.set(1, 0.6, 1);
    hair.castShadow = true;
    group.add(hair);
    
    // Glasses
    const glassesGroup = new THREE.Group();
    
    // Glasses frame
    const frameGeometry = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const leftLens = new THREE.Mesh(frameGeometry, frameMaterial);
    leftLens.position.set(-0.08, 0.82, 0.22);
    leftLens.rotation.y = Math.PI / 2;
    glassesGroup.add(leftLens);
    
    const rightLens = new THREE.Mesh(frameGeometry, frameMaterial);
    rightLens.position.set(0.08, 0.82, 0.22);
    rightLens.rotation.y = Math.PI / 2;
    glassesGroup.add(rightLens);
    
    // Bridge
    const bridgeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8);
    const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
    bridge.position.set(0, 0.82, 0.22);
    bridge.rotation.z = Math.PI / 2;
    glassesGroup.add(bridge);
    
    group.add(glassesGroup);
    
    // Laptop (more detailed)
    const laptopBase = new THREE.BoxGeometry(0.9, 0.08, 0.65);
    const laptopMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
    const laptop = new THREE.Mesh(laptopBase, laptopMaterial);
    laptop.position.set(0, -0.4, 0.4);
    laptop.castShadow = true;
    group.add(laptop);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(0.8, 0.55, 0.03);
    const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x111827 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.15, 0.75);
    screen.rotation.x = -0.15;
    screen.castShadow = true;
    group.add(screen);
    
    // Screen display (with code-like pattern)
    const displayGeometry = new THREE.BoxGeometry(0.75, 0.5, 0.01);
    const displayMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0d1117,
        transparent: true,
        opacity: 0.9
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 0.15, 0.77);
    display.rotation.x = -0.15;
    group.add(display);
    
    // Code lines on screen
    const codeLines = [];
    for (let i = 0; i < 8; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.005);
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: i % 2 === 0 ? 0x06b6d4 : 0x10b981,
            transparent: true,
            opacity: 0.8
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(
            (Math.random() - 0.5) * 0.2,
            0.3 - (i * 0.08),
            0.775
        );
        line.rotation.x = -0.15;
        line.scale.x = 0.3 + Math.random() * 0.7;
        group.add(line);
        codeLines.push(line);
    }
    
    // Arms (more realistic positioning)
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 10);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x1f2937 }); // Same as hoodie
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.1, 0.1);
    leftArm.rotation.z = 0.4;
    leftArm.rotation.x = 0.3;
    leftArm.castShadow = true;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.1, 0.1);
    rightArm.rotation.z = -0.4;
    rightArm.rotation.x = 0.3;
    rightArm.castShadow = true;
    group.add(rightArm);
    
    // Hands
    const handGeometry = new THREE.SphereGeometry(0.06, 12, 12);
    const handMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.2, -0.3, 0.45);
    leftHand.castShadow = true;
    group.add(leftHand);
    
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.2, -0.3, 0.45);
    rightHand.castShadow = true;
    group.add(rightHand);
    
    // Coffee cup (essential programmer accessory)
    const cupGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 12);
    const cupMaterial = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.set(0.6, -0.3, 0.2);
    cup.castShadow = true;
    group.add(cup);
    
    // Coffee
    const coffeeGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.02, 12);
    const coffeeMaterial = new THREE.MeshPhongMaterial({ color: 0x3c2415 });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.set(0.6, -0.23, 0.2);
    group.add(coffee);
    
    // Phone (another programmer essential)
    const phoneGeometry = new THREE.BoxGeometry(0.05, 0.12, 0.008);
    const phoneMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phone.position.set(-0.6, -0.35, 0.3);
    phone.rotation.z = Math.PI / 6;
    phone.castShadow = true;
    group.add(phone);
    
    // Mouse
    const mouseGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.04);
    const mouseMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
    const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
    mouse.position.set(0.4, -0.32, 0.1);
    mouse.castShadow = true;
    group.add(mouse);
    
    scene.add(group);
    
    // Position camera
    camera.position.set(2, 1, 3);
    camera.lookAt(0, 0, 0);    // Animation loop with mobile optimization
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        // Throttle frame rate on mobile
        if (currentTime - lastTime < frameInterval) return;
        lastTime = currentTime;
        
        // Gentle rotation - adjust speed based on device
        group.rotation.y += isMobile ? 0.004 : 0.006;
        
        // Floating animation - reduce on mobile
        group.position.y = Math.sin(Date.now() * 0.002) * (isMobile ? 0.04 : 0.08);
        
        // Code lines animation (blinking effect) - reduce on mobile
        if (!isMobile || Math.random() > 0.7) {
            codeLines.forEach((line, index) => {
                const time = Date.now() * 0.001;
                line.material.opacity = 0.3 + Math.sin(time + index * 0.5) * 0.5;
            });
        }
        
        // Coffee steam effect (slight rotation) - reduce on mobile
        coffee.rotation.y += isMobile ? 0.005 : 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize for responsive 3D scene
    function handleResize() {
        const container = canvas.parentElement;
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }
    
    // Add resize listener with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Handle orientation change on mobile
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 500);
        });
    }
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
    
    // Initialize 3D skill cards
    initSkillCards();
}

function initSkillCards() {
    const skillsData = {
        html: { color: 0xe34f26, name: 'HTML5' },
        css: { color: 0x1572b6, name: 'CSS3' },
        javascript: { color: 0xf7df1e, name: 'JavaScript' },
        react: { color: 0x61dafb, name: 'React' },
        nodejs: { color: 0x339933, name: 'Node.js' },
        python: { color: 0x3776ab, name: 'Python' },
        c: { color: 0x00599c, name: 'C' },
        git: { color: 0xf05032, name: 'Git' },
        ai: { color: 0x8b5cf6, name: 'AI Tools' }
    };
    
    Object.keys(skillsData).forEach(skill => {
        const canvas = document.getElementById(`${skill === 'javascript' ? 'js' : skill === 'nodejs' ? 'node' : skill}-canvas`);
        if (canvas) {
            create3DSkillCard(canvas, skillsData[skill]);
        }
    });
}

function create3DSkillCard(canvas, skillData) {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(120, 120);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(skillData.color, 1);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(skillData.color, 0.8, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Create simple 3D card
    const group = new THREE.Group();
    
    // Main card
    const cardGeometry = new THREE.BoxGeometry(1, 1, 0.1);
    const cardMaterial = new THREE.MeshPhongMaterial({ 
        color: skillData.color,
        transparent: true,
        opacity: 0.8
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.castShadow = true;
    group.add(card);
    
    // Card border
    const borderGeometry = new THREE.BoxGeometry(1.05, 1.05, 0.05);
    const borderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.03;
    group.add(border);
    
    scene.add(group);
    
    // Position camera
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);
    
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Gentle rotation
        if (!isHovered) {
            group.rotation.y += 0.01;
            group.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        } else {
            // Interactive rotation on hover
            group.rotation.y += mouseX * 0.02;
            group.rotation.x += mouseY * 0.02;
        }
        
        // Floating animation
        group.position.y = Math.sin(Date.now() * 0.003) * 0.1;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Mouse interaction
    canvas.parentElement.addEventListener('mouseenter', () => {
        isHovered = true;
        gsap.to(group.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    canvas.parentElement.addEventListener('mouseleave', () => {
        isHovered = false;
        mouseX = 0;
        mouseY = 0;
        gsap.to(group.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    canvas.parentElement.addEventListener('mousemove', (event) => {
        if (isHovered) {
            const rect = canvas.getBoundingClientRect();
            mouseX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            mouseY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        }
    });
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
      // Add click handlers for project buttons (now anchor tags)
    document.querySelectorAll('.view-code-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Don't prevent default since we want the link to work
            
            // Add a click effect
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
            
            // Optional: Log for analytics or debugging
            console.log('View Code clicked for:', this.closest('.project-item').querySelector('.project-name').textContent);
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
    gsap.set('.timeline-line', { opacity: 0, scaleY: 0 });
    gsap.set('.timeline-item', { opacity: 0, y: 50 });
    gsap.set('.stat-item', { opacity: 0, y: 30 });
    
    // Animate experience title
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
        opacity: 1,
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        transformOrigin: "top center"
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
    
    // Animate stats section
    gsap.timeline({
        scrollTrigger: {
            trigger: ".experience-stats",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
        }
    })
    .to('.stat-item', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
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

// Skills section animations and interactions complete
