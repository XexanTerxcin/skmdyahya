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

        menuLinks.forEach(menuLink => {
            const section = document.getElementById(menuLink.getAttribute("href").substring(1));

            if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
                makeActive(menuLink);
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


/*const sr = ScrollReveal({
    origin: 'top',
    distance: '5000px',
    duration: 0,
    delay: 0,
    // reset: true
});

sr.reveal('.follow-text, .social-icon', { delay: 0 });*/





// Add at the end of main.js or in a new script tag

// Contact Form Handler with Google Apps Script
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the submit button
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
            
            // REPLACE THIS URL WITH YOUR DEPLOYED WEB APP URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwx2RMJRvxPuCV4m4M6sVakws3OlVgIJnEHA67Jqtzw7n8h15BLN8b_uAWemhuJOalZ/exec';
            
            // Send data to Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',  // Important for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                // Since we use no-cors, we can't read the response
                // But we know it worked if we get here without error
                submitBtn.textContent = 'Sent!';
                submitBtn.style.backgroundColor = '#00a651';
                submitBtn.disabled = false;
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ff6000';
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.textContent = '❌ Error! Try Again';
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
    
    // Close menu
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
    
    // Menu link click - close menu and navigate
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: "smooth",
                });
            }
            
            // Update active state
            menuLinks.forEach(menuLink => menuLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
    
    // Close menu on window resize (if it was open and screen becomes larger)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 540 && headerList.classList.contains('active')) {
            closeMenu();
        }
    });
});