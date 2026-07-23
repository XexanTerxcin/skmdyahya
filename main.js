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

// Google Apps Script URL for Blog Posts
const BLOG_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcc346Oh90GlCQH0pfE2PPPqLbtZHnHbnnFO5lUiweUjcvSVwVh0QBj6_O2ZbWYjtQ/exec';

let currentPage = 1;
let totalPages = 1;

/**
 * Load blog posts from Google Apps Script
 */
function loadBlogPosts(page) {
    page = page || 1;
    currentPage = page;
    
    const container = document.getElementById('blogContainer');
    const pagination = document.getElementById('paginationControls');
    
    // Show loading state
    container.innerHTML = `
        <div class="blog-loading">
            <div class="spinner"></div>
            <p>Loading posts...</p>
        </div>
    `;
    pagination.innerHTML = '';
    
    // Call Google Apps Script via fetch
    fetch(BLOG_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            action: 'getBlogPosts',
            page: page 
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data && data.success) {
            renderBlogPosts(data);
            renderPagination(data);
        } else {
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="bi bi-journal-x"></i>
                    <h3>No Posts Yet</h3>
                    <p>${data.message || 'Check back soon for new content!'}</p>
                </div>
            `;
            pagination.innerHTML = '';
        }
    })
    .catch(function(error) {
        console.error('Error loading blog posts:', error);
        container.innerHTML = `
            <div class="blog-error">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <h3>Error Loading Posts</h3>
                <p>${error.message || 'Please try again later.'}</p>
                <button class="btn-retry" onclick="loadBlogPosts(${currentPage})">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        `;
        pagination.innerHTML = '';
    });
}

/**
 * Render blog posts
 */
function renderBlogPosts(data) {
    const container = document.getElementById('blogContainer');
    const posts = data.posts || [];
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="blog-empty">
                <i class="bi bi-journal"></i>
                <h3>No Posts Yet</h3>
                <p>Check back soon for new content!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    posts.forEach(function(post) {
        // Use placeholder image if no image provided
        var imageUrl = post.image || 'https://via.placeholder.com/400x200/2a2a2a/ff6000?text=No+Image';
        
        html += `
            <div class="blog-card">
                <div class="blog-card-image">
                    <img src="${imageUrl}" alt="${post.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/2a2a2a/ff6000?text=Image+Not+Found'">
                </div>
                <div class="blog-card-content">
                    <span class="blog-card-category">${post.category || 'General'}</span>
                    <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
                    <p class="blog-card-description">${escapeHtml(post.description || '')}</p>
                    <div class="blog-card-meta">
                        <span class="date"><i class="bi bi-calendar3"></i> ${post.date || ''}</span>
                        <span class="read-time"><i class="bi bi-clock"></i> ${post.readTime || '3 min'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Render pagination
 */
function renderPagination(data) {
    const pagination = document.getElementById('paginationControls');
    const totalPages = data.totalPages || 1;
    const currentPage = data.currentPage || 1;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `
        <li class="${currentPage <= 1 ? 'disabled' : ''}">
            <a href="#" onclick="event.preventDefault(); if(${currentPage > 1}) loadBlogPosts(${currentPage - 1});">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers - show pages around current page
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);
    
    // Show first page if not in range
    if (startPage > 1) {
        html += `<li><a href="#" onclick="event.preventDefault(); loadBlogPosts(1);">1</a></li>`;
        if (startPage > 2) {
            html += `<li class="disabled"><span>...</span></li>`;
        }
    }
    
    for (var i = startPage; i <= endPage; i++) {
        html += `
            <li class="${i === currentPage ? 'active' : ''}">
                <a href="#" onclick="event.preventDefault(); loadBlogPosts(${i});">${i}</a>
            </li>
        `;
    }
    
    // Show last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<li class="disabled"><span>...</span></li>`;
        }
        html += `<li><a href="#" onclick="event.preventDefault(); loadBlogPosts(${totalPages});">${totalPages}</a></li>`;
    }
    
    // Next button
    html += `
        <li class="${currentPage >= totalPages ? 'disabled' : ''}">
            <a href="#" onclick="event.preventDefault(); if(${currentPage < totalPages}) loadBlogPosts(${currentPage + 1});">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

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
    
    // Load blog posts after a small delay to ensure DOM is ready
    setTimeout(function() {
        if (document.getElementById('blogContainer')) {
            loadBlogPosts(1);
        }
    }, 200);
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