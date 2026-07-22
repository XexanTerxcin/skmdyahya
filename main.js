document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll("#header-list-menu a");

    function makeActive(link) {
        menuLinks.forEach(menuLink => menuLink.classList.remove("active"));
        link.classList.add("active");
    }

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

    function handleScroll() {
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
    }

    menuLinks.forEach(menuLink => menuLink.addEventListener("click", handleLinkClick));
    window.addEventListener("scroll", handleScroll);

    // Bootstrap navbar toggler support (for future mobile menu implementation)
    const navToggler = document.querySelector('.navbar-toggler');
    if (navToggler) {
        navToggler.addEventListener('click', function() {
            this.classList.toggle('collapsed');
        });
    }
});

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '50px',
    duration: 1500,
    delay: 0,
    //reset: true
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

// Contact Form Handler with Google Apps Script
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.contact-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('_subject'),
                message: formData.get('text')
            };
            
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwx2RMJRvxPuCV4m4M6sVakws3OlVgIJnEHA67Jqtzw7n8h15BLN8b_uAWemhuJOalZ/exec';
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                submitBtn.textContent = 'Sent!';
                submitBtn.style.backgroundColor = '#00a651';
                submitBtn.disabled = false;
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ff6000';
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.textContent = 'Error! Try Again';
                submitBtn.style.backgroundColor = '#dc3545';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ff6000';
                }, 3000);
            });
        });
    }
});

// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const headerList = document.getElementById('header-list');
    const menuLinks = document.querySelectorAll('#header-list-menu a');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        headerList.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = headerList.classList.contains('active') ? 'hidden' : '';
    }
    
    // Close menu with animation
    function closeMenu() {
        hamburger.classList.remove('active');
        headerList.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Hamburger click
    hamburger.addEventListener('click', toggleMenu);
    
    // Overlay click to close
    overlay.addEventListener('click', closeMenu);
    
    // Menu link click - closes menu and navigates
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Update active state
            menuLinks.forEach(menuLink => menuLink.classList.remove('active'));
            this.classList.add('active');
            
            // Close the hamburger menu immediately
            closeMenu();
            
            // Scroll to section with smooth animation
            if (targetSection) {
                // Small delay to ensure menu closes before scrolling
                setTimeout(() => {
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
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 540 && headerList.classList.contains('active')) {
            closeMenu();
        }
    });
});