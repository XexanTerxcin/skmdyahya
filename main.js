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
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize everything when DOM is ready
     */
    function init() {
        initMenu();
        initContactForm();
        initHamburgerMenu();
        initScrollReveal();
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