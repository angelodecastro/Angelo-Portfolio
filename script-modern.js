// Modern Portfolio JavaScript - Angelo De Castro

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM elements
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');
const navLinks = $$('.nav__link');
const themeToggle = $('#theme-toggle');
const sections = $$('section[id]');

// State management
let currentTheme = localStorage.getItem('theme') || 'light';
let isMenuOpen = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeLazyLoading();
    initializeAccessibility();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'bx bx-moon' : 'bx bx-sun';
    }
}

// Navigation Management
function initializeNavigation() {
    // Mobile menu toggle
    navToggle?.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            smoothScroll(e);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('show', isMenuOpen);
    navToggle.classList.toggle('active', isMenuOpen);
    navToggle.setAttribute('aria-expanded', isMenuOpen.toString());
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMenuOpen = false;
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = $(targetId);
    
    if (targetSection) {
        const headerHeight = $('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Active navigation link
    window.addEventListener('scroll', throttle(updateActiveNavLink, 16));
    
    // Header background on scroll
    window.addEventListener('scroll', throttle(updateHeaderBackground, 16));
}

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = $(`.nav__link[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

function updateHeaderBackground() {
    const header = $('.header');
    const scrollY = window.pageYOffset;
    
    if (scrollY > 50) {
        header.style.backgroundColor = currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.backgroundColor = currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 1)' 
            : 'rgba(15, 23, 42, 1)';
    }
}

// Animations
function initializeAnimations() {
    // Initialize ScrollReveal if available
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            easing: 'ease-in-out',
            reset: false
        });
        
        // Animate elements
        sr.reveal('.animate-fade-in-up', {
            interval: 200
        });
        
        sr.reveal('.animate-fade-in', {
            origin: 'top',
            interval: 100
        });
        
        sr.reveal('.project__card', {
            interval: 150
        });
        
        sr.reveal('.publication__card', {
            interval: 100
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements that don't have animation classes
    $$('.about__card, .project__card, .publication__card').forEach(el => {
        if (!el.classList.contains('animate-fade-in-up')) {
            observer.observe(el);
        }
    });
}

// Lazy Loading
function initializeLazyLoading() {
    const images = $$('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Accessibility
function initializeAccessibility() {
    // Focus management for mobile menu
    navToggle?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '10px';
    skipLink.style.left = '10px';
    skipLink.style.zIndex = '9999';
    skipLink.style.padding = '8px 16px';
    skipLink.style.backgroundColor = 'var(--primary-600)';
    skipLink.style.color = 'white';
    skipLink.style.textDecoration = 'none';
    skipLink.style.borderRadius = '4px';
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.position = 'fixed';
        skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.position = 'absolute';
        skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Announce theme changes to screen readers
    const themeAnnouncer = document.createElement('div');
    themeAnnouncer.setAttribute('aria-live', 'polite');
    themeAnnouncer.setAttribute('aria-atomic', 'true');
    themeAnnouncer.className = 'sr-only';
    document.body.appendChild(themeAnnouncer);
    
    themeToggle?.addEventListener('click', () => {
        setTimeout(() => {
            themeAnnouncer.textContent = `Switched to ${currentTheme} mode`;
        }, 100);
    });
}

// Performance Utilities
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Enhanced micro-interactions
function initializeMicroInteractions() {
    // Button hover effects
    $$('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
    
    // Card hover effects
    $$('.project__card, .publication__card, .about__card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth focus indicators
    $$('a, button, input, textarea').forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-600)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

// Progressive Web App features
function initializePWA() {
    // Service worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Install prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installButton = document.createElement('button');
        installButton.textContent = 'Install App';
        installButton.className = 'btn btn-outline install-btn';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '20px';
        installButton.style.right = '20px';
        installButton.style.zIndex = '1000';
        
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installButton.remove();
            });
        });
        
        document.body.appendChild(installButton);
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Something went wrong. Please refresh the page.';
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '20px';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translateX(-50%)';
    errorMessage.style.backgroundColor = 'var(--accent-red)';
    errorMessage.style.color = 'white';
    errorMessage.style.padding = '10px 20px';
    errorMessage.style.borderRadius = '4px';
    errorMessage.style.zIndex = '9999';
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
});

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initializeMicroInteractions();
    initializePWA();
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        toggleMobileMenu,
        throttle,
        debounce
    };
}