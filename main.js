(function() {
    'use strict';
    
    // ============================================
    // PRIVATE VARIABLES
    // ============================================
    let menuLinks = null;
    let isMenuOpen = false;
    let scrollTimeout = null;
    
    // ============================================
    // PRIVATE FUNCTIONS - MAIN MENU
    // ============================================
    
    /**
     * Make a menu link active and remove active state from others
     * @param {HTMLElement} link - The link to make active
     */
    function makeActive(link) {
        menuLinks.forEach(menuLink => menuLink.classList.remove("active"));
        link.classList.add("active");
    }
    
    /**
     * Handle click on a menu link
     * @param {Event} event - The click event
     */
    function handleLinkClick(event) {
        event.preventDefault();
        
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) {
            return;
        }
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: "smooth",
        });
        
        makeActive(this);
    }
    
    /**
     * Handle scroll event to update active menu item
     */
    function handleScroll() {
        // Throttle scroll events for performance
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            const fromTop = window.scrollY;
            const offset = 100;
            
            menuLinks.forEach(menuLink => {
                const section = document.getElementById(menuLink.getAttribute("href").substring(1));
                
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (fromTop + offset >= sectionTop && fromTop + offset < sectionBottom) {
                        makeActive(menuLink);
                    }
                }
            });
        });
    }
    
    /**
     * Initialize the main navigation menu
     */
    function initMenu() {
        menuLinks = document.querySelectorAll("#header-list-menu a");
        
        menuLinks.forEach(menuLink => {
            menuLink.addEventListener("click", handleLinkClick);
        });
        
        window.addEventListener("scroll", handleScroll);
        
        // Bootstrap navbar toggler support
        const navToggler = document.querySelector('.navbar-toggler');
        if (navToggler) {
            navToggler.addEventListener('click', function() {
                this.classList.toggle('collapsed');
            });
        }
    }
    
    // ============================================
    // PRIVATE FUNCTIONS - CONTACT FORM
    // ============================================
    
    /**
     * Initialize the contact form with Google Apps Script
     */
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            return;
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.contact-submit');
            const originalText = submitBtn.textContent;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Collect form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('_subject'),
                message: formData.get('text')
            };
            
            // Google Apps Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwTKTkEy7FHzsi0bpUhrdjXC7LRPn1TRZ7UCJ4PQH7AheiwahuMs_tZhtX4HmnIhsJ-/exec';
            
            // Send data to Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                submitBtn.textContent = 'Sent!';
                submitBtn.style.backgroundColor = '#00a651';
                submitBtn.disabled = false;
                contactForm.reset();
                
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ff6000';
                }, 3000);
            })
            .catch(function(error) {
                console.error('Error:', error);
                submitBtn.textContent = 'Error! Try Again';
                submitBtn.style.backgroundColor = '#dc3545';
                submitBtn.disabled = false;
                
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ff6000';
                }, 3000);
            });
        });
    }
    
    // ============================================
    // PRIVATE FUNCTIONS - HAMBURGER MENU
    // ============================================
    
    /**
     * Toggle the hamburger menu
     */
    function toggleMenu() {
        const hamburger = document.getElementById('hamburger');
        const headerList = document.getElementById('header-list');
        const overlay = document.querySelector('.menu-overlay');
        
        if (!hamburger || !headerList || !overlay) {
            return;
        }
        
        hamburger.classList.toggle('active');
        headerList.classList.toggle('active');
        overlay.classList.toggle('active');
        
        isMenuOpen = headerList.classList.contains('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    
    /**
     * Close the hamburger menu
     */
    function closeMenu() {
        const hamburger = document.getElementById('hamburger');
        const headerList = document.getElementById('header-list');
        const overlay = document.querySelector('.menu-overlay');
        
        if (!hamburger || !headerList || !overlay) {
            return;
        }
        
        hamburger.classList.remove('active');
        headerList.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
    }
    
    /**
     * Initialize the hamburger menu
     */
    function initHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.createElement('div');
        
        if (!hamburger) {
            return;
        }
        
        // Create overlay
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        // Hamburger click - toggle menu
        hamburger.addEventListener('click', toggleMenu);
        
        // Overlay click - close menu
        overlay.addEventListener('click', closeMenu);
        
        // Menu link click - close menu and navigate
        const menuLinksHamburger = document.querySelectorAll('#header-list-menu a');
        menuLinksHamburger.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                // Update active state
                menuLinksHamburger.forEach(function(menuLink) {
                    menuLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close the hamburger menu immediately
                closeMenu();
                
                // Scroll to section with smooth animation
                if (targetSection) {
                    setTimeout(function() {
                        window.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: "smooth",
                        });
                    }, 100);
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
        
        // Close menu on window resize (if screen becomes larger than 540px)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 540 && isMenuOpen) {
                closeMenu();
            }
        });
    }
    
    // ============================================
    // PRIVATE FUNCTIONS - SCROLL REVEAL
    // ============================================
    
    /**
     * Initialize ScrollReveal animations
     */
    function initScrollReveal() {
        // Check if ScrollReveal is available
        if (typeof ScrollReveal === 'undefined') {
            return;
        }
        
        const sr = ScrollReveal({
            origin: 'top',
            distance: '50px',
            duration: 1500,
            delay: 0,
        });
        
        sr.reveal('.home-text, .social-media-button, .cv-button', {});
        sr.reveal('.my-image-1', { delay: 0 });
        sr.reveal('.about-text, .a-1, .a-2, .a-3, .a-4', { delay: 0 });
        sr.reveal('.my-image-2', { delay: 0 });
        sr.reveal('.skills-text, .s-1, .s-2', { delay: 0 });
        sr.reveal('.skill-1, .skill-2, .skill-3, .skill-4, .skill-5', { interval: 0 });
        sr.reveal('.skills-right', { delay: 0 });
        sr.reveal('.work-headline, .work-container', {});
        sr.reveal('.work-img', { interval: 0 });
        sr.reveal('.contact-headline, .contact-container', {});
        sr.reveal('.follow-text, .social-icon', { delay: 0 });
    }
    
    // ============================================
    // PUBLIC API (Optional - if you need to expose anything)
    // ============================================
    const publicAPI = {
        // Expose only what's necessary
        // In this case, nothing needs to be exposed
    };
    

    // ============================================
// PRIVATE FUNCTIONS - BLOG / WORK SECTION
// ============================================

const BLOG_API =
"https://script.google.com/macros/s/AKfycbwybwJ3qvrQQTVkvUaYls8RjNM8t8BMJg9q_X68QuRa514ScwlEE6CM9nDWWvfVyK8h/exec";

let currentPage = 1;

function loadBlogPosts(page = 1){

    currentPage = page;

    fetch(`${BLOG_API}?page=${page}`)
    .then(res => res.json())
    .then(data => {

        console.log("BLOG API:", data);

        if (!data.success) {

            document.getElementById("blogContainer").innerHTML=
            "<h3>Unable to load posts.</h3>";

            return;

        }

        renderPosts(data.posts);

        renderPagination(
            data.currentPage,
            data.totalPages
        );

    })
    .catch(err=>{

        console.error(err);

        document.getElementById("blogContainer").innerHTML=
        "<h3>Failed to load posts.</h3>";

    });

}

function renderPosts(posts){

    const container=document.getElementById("blogContainer");

    let html="";

    posts.forEach(post=>{

        html+=`

<div class="blog-card">

<img src="${post.image}"
alt="${post.title}">

<div class="blog-card-content">

<span>${post.category}</span>

<h3>${escapeHTML(post.title)}</h3>

<p>${escapeHTML(post.description)}</p>

<div>

<span>${post.date}</span>

<span>${post.readTime}</span>

</div>

</div>

</div>

`;

    });

    container.innerHTML=html;

}

function renderPagination(current,total){

    const nav=document.getElementById("paginationControls");

    let html="";

    html+=`
<li class="${current===1?"disabled":""}">
<a href="#" onclick="return changePage(${current-1})">Previous</a>
</li>
`;

    for(let i=1;i<=total;i++){

        html+=`
<li class="${i===current?"active":""}">
<a href="#" onclick="return changePage(${i})">${i}</a>
</li>
`;

    }

    html+=`
<li class="${current===total?"disabled":""}">
<a href="#" onclick="return changePage(${current+1})">Next</a>
</li>
`;

    nav.innerHTML=html;

}

function changePage(page){

    loadBlogPosts(page);

    return false;

}

function escapeHTML(text){

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}

// Needed because your onclick is in HTML
window.changePage = changePage;

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize everything when DOM is ready
     */
/**
 * Initialize everything when DOM is ready
 */
function init() {
    initMenu();
    initContactForm();
    initHamburgerMenu();
    initScrollReveal();
    
    // Load blog posts
    loadBlogPosts();
}
    
    // Start everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        init();
    }
    
    // ============================================
    // OPTIONAL: Expose public API (if needed)
    // ============================================
    // window.Portfolio = publicAPI;
    
})(); // End of IIFE

// ============================================
// 3D GALAXY BACKGROUND
// ============================================

(function() {
    'use strict';

    const canvas = document.getElementById('galaxy-canvas');
    const container = document.getElementById('galaxy-bg');
    const ctx = canvas.getContext('2d', { alpha: false });

    let w, h;
    let centerX, centerY;

    // ----- Particle count -----
    const PARTICLE_COUNT = 5000;
    let particles = [];

    // ----- Mouse tracking -----
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    let lastTime = 0;
    const DRIFT_SPEED_BASE = 0.003;

    // ----- 3D rotation angles -----
    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    // ----- Helpers -----
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // ----- 3D rotation matrix -----
    function rotate3D(x, y, z, angleX, angleY) {
        let cosY = Math.cos(angleY);
        let sinY = Math.sin(angleY);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;
        let y1 = y;

        let cosX = Math.cos(angleX);
        let sinX = Math.sin(angleX);
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;
        let x2 = x1;

        return { x: x2, y: y2, z: z2 };
    }

    // ----- Project 3D to 2D -----
    function project3D(x3d, y3d, z3d, fov) {
        const perspective = fov / (fov + z3d);
        return {
            x: x3d * perspective,
            y: y3d * perspective,
            scale: perspective
        };
    }

    // ----- Particle factory - pure neon green -----
   // ----- Particle factory - pure orange (#ff6600) -----
function createParticle() {
    // #ff6600 = hsl(24, 100%, 50%)
    const hue = 24; // Orange
    const sat = 100;
    const lig = 50; // Bright neon

    let size;
    const rnd = Math.random();
    if (rnd < 0.70) {
        size = rand(0.1, 0.4);
    } else if (rnd < 0.90) {
        size = rand(0.4, 0.8);
    } else if (rnd < 0.98) {
        size = rand(0.8, 1.4);
    } else {
        size = rand(1.4, 2.5);
    }

    const range = 1.8;
    return {
        x3d: rand(-range, range),
        y3d: rand(-range, range),
        z3d: rand(-range, range),
        size: size,
        hue: hue,
        sat: sat,
        lig: lig,
        alpha: 1.0,
        vx: rand(-0.001, 0.001),
        vy: rand(-0.001, 0.001),
        vz: rand(-0.001, 0.001),
        life: 1.0,
        decay: rand(0.0001, 0.001) * (0.5 + Math.random() * 0.8),
        phase: rand(0, Math.PI * 2),
        type: Math.min(2, Math.floor(rnd * 3))
    };
}

    // ----- Init particles -----
    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    // ----- Resize -----
    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        centerX = w / 2;
        centerY = h / 2;
    }

    // ----- Update particles -----
    function updateParticles(time) {
        const delta = Math.min(0.05, (time - lastTime) / 16);
        lastTime = time;

        for (let p of particles) {
            p.x3d += p.vx * delta * 2;
            p.y3d += p.vy * delta * 2;
            p.z3d += p.vz * delta * 2;

            const bound = 2.0;
            if (p.x3d > bound) p.x3d = -bound;
            else if (p.x3d < -bound) p.x3d = bound;
            if (p.y3d > bound) p.y3d = -bound;
            else if (p.y3d < -bound) p.y3d = bound;
            if (p.z3d > bound) p.z3d = -bound;
            else if (p.z3d < -bound) p.z3d = bound;

            p.life -= p.decay * delta * 1.5;
            if (p.life <= 0.0) {
                const newP = createParticle();
                newP.x3d = p.x3d + rand(-0.05, 0.05);
                newP.y3d = p.y3d + rand(-0.05, 0.05);
                newP.z3d = p.z3d + rand(-0.05, 0.05);
                Object.assign(p, newP);
                p.life = 1.0;
                p.decay = rand(0.0001, 0.001) * (0.5 + Math.random() * 0.8);
            }

            p.phase += 0.005 * delta;
        }

        mouseX += (targetMouseX - mouseX) * 0.15;
        mouseY += (targetMouseY - mouseY) * 0.15;

        targetRotY = (mouseX - 0.5) * 0.8;
        targetRotX = (mouseY - 0.5) * 0.8;

        rotX += (targetRotX - rotX) * 0.1;
        rotY += (targetRotY - rotY) * 0.1;
    }

    // ----- Render -----
    function render() {
    // Background
    const grad = ctx.createRadialGradient(
        centerX * 0.7, centerY * 0.6, 50,
        centerX * 0.4, centerY * 0.3, w * 0.9
    );
    grad.addColorStop(0, '#1a0a05');
    grad.addColorStop(0.5, '#0d0604');
    grad.addColorStop(1, '#040202');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'source-over';

    const fov = 2.5;
    const scale3D = Math.min(w, h) * 0.5;

    const sorted = [...particles].sort((a, b) => a.z3d - b.z3d);

    for (let p of sorted) {
        const rotated = rotate3D(p.x3d, p.y3d, p.z3d, rotX, rotY);
        const projected = project3D(rotated.x, rotated.y, rotated.z, fov);

        if (rotated.z < -fov * 0.8) continue;

        const px = centerX + projected.x * scale3D;
        const py = centerY + projected.y * scale3D;
        const scale = projected.scale;

        const lifeFactor = 0.7 + 0.3 * Math.sin(p.phase);
        let size = p.size * scale * (0.7 + 0.3 * p.life) * (0.85 + 0.15 * lifeFactor);
        size = Math.max(0.05, Math.min(size, 2.8));

        const alpha = Math.min(1.0, 0.5 + 0.5 * p.life);

        // FIX: Use exactly 50% lightness for #ff6600
        // Only slight variation for depth (45-55%)
        let lig = 50;
        if (p.type === 0) lig = 45;
        else if (p.type === 1) lig = 50;
        else lig = 55;

        // Draw particle with pure orange #ff6600
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${lig}%, ${alpha})`;
        ctx.fill();

        // Brighter core for larger particles - still orange, not white
        if (p.type >= 1 && p.life > 0.5 && size > 0.5) {
            const coreSize = size * (p.type === 2 ? 0.4 : 0.25);
            ctx.beginPath();
            ctx.arc(px, py, coreSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.5})`;
            ctx.fill();
        }

        // Tiny bright core for large particles
        if (p.type === 2 && p.life > 0.6 && size > 1.0) {
            const coreSize = size * 0.1;
            ctx.beginPath();
            ctx.arc(px, py, coreSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${alpha * 0.6})`;
            ctx.fill();
        }
    }

    ctx.globalCompositeOperation = 'source-over';

    const fogGrad = ctx.createRadialGradient(
        centerX, centerY, 50,
        centerX, centerY, w * 0.8
    );
    fogGrad.addColorStop(0, 'rgba(30, 20, 10, 0.0)');
    fogGrad.addColorStop(0.6, 'rgba(15, 5, 0, 0.0)');
    fogGrad.addColorStop(1, 'rgba(8, 3, 0, 0.12)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);
}

    // ----- Animation loop -----
    function animate(time) {
        updateParticles(time);
        render();
        requestAnimationFrame(animate);
    }

    // ----- Mouse / touch events -----
    function handleMove(clientX, clientY) {
        targetMouseX = Math.min(1, Math.max(0, clientX / w));
        targetMouseY = Math.min(1, Math.max(0, clientY / h));
    }

    // ----- Init -----
    function init() {
        resize();
        initParticles();

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function(e) {
            handleMove(e.clientX, e.clientY);
        });
        window.addEventListener('touchmove', function(e) {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY);
            }
        }, { passive: true });
        window.addEventListener('touchstart', function(e) {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        requestAnimationFrame(animate);
    }

    init();

})();