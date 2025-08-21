// ===== GLOBAL VARIABLES =====
let mouseCursor, cursorFollower;
let typingWords = ['Developer', 'Designer', 'Gamer', 'Creator', 'Problem Solver', 'Tech Enthusiast'];
let currentWord = 0;
let currentChar = 0;
let isDeleting = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initCursor();
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initProjectCards();
    initContactForm();
    initLightModeToggle();
});

// ===== CUSTOM CURSOR =====
function initCursor() {
    mouseCursor = document.querySelector('.cursor');
    cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        mouseCursor.style.left = e.clientX + 'px';
        mouseCursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            mouseCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            mouseCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.querySelector('.navbar').classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.querySelector('.navbar').classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    
    function type() {
        const currentWordText = typingWords[currentWord];
        
        if (isDeleting) {
            typingElement.textContent = currentWordText.substring(0, currentChar - 1);
            currentChar--;
            
            if (currentChar === 0) {
                isDeleting = false;
                currentWord = (currentWord + 1) % typingWords.length;
                setTimeout(type, 500);
            } else {
                // Add random typing variations for deleting
                const randomDelay = Math.random() * 50 + 30;
                setTimeout(type, randomDelay);
            }
        } else {
            typingElement.textContent = currentWordText.substring(0, currentChar + 1);
            currentChar++;
            
            if (currentChar === currentWordText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else {
                // Add random typing variations for typing
                const randomDelay = Math.random() * 100 + 50;
                setTimeout(type, randomDelay);
            }
        }
    }
    
    setTimeout(type, 1000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        observer.observe(el);
    });

    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.float-item');
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== PROJECT CARDS =====
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Add stagger animation delay
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('✨ Message sent successfully! I\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showNotification('❌ Oops! Something went wrong. Please try again.', 'error');
            }
            
            // Reset button state
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        maxWidth: '400px',
        fontWeight: '500'
    });
    
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '0.3rem',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s ease'
    });
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for performance
function throttle(func, wait) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    }
}

// Smooth reveal animation for skills
function animateSkills() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttled scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNav();
}, 100));

// Preload critical resources
function preloadResources() {
    // Preload font files if needed
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
}

// ===== EASTER EGGS =====

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    // Create rainbow effect
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        heroName.style.backgroundSize = '200% 200%';
        heroName.style.webkitBackgroundClip = 'text';
        heroName.style.webkitTextFillColor = 'transparent';
        heroName.style.animation = 'rainbow 2s ease-in-out infinite';
        
        // Add rainbow keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        showNotification('🌈 You found the easter egg! Welcome to the rainbow zone!', 'success');
        
        // Reset after 5 seconds
        setTimeout(() => {
            heroName.style.background = 'linear-gradient(135deg, var(--light-color), var(--primary-color))';
            heroName.style.animation = 'letterFloat 3s ease-in-out infinite';
        }, 5000);
    }
}

// ===== LIGHT MODE TOGGLE (EASTER EGG) =====
function initLightModeToggle() {
    const lightModeToggle = document.getElementById('lightModeToggle');
    
    if (lightModeToggle) {
        let warningShown = false;
        
        // Add hover warning
        lightModeToggle.addEventListener('mouseenter', () => {
            if (!warningShown) {
                showNotification('Warning: Light mode attracts bugs! Are you sure?', 'error');
                warningShown = true;
                
                // Reset warning after 10 seconds
                setTimeout(() => {
                    warningShown = false;
                }, 10000);
            }
        });
        
        // Handle click - redirect to 404 page
        lightModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add dramatic effect before redirect
            lightModeToggle.style.animation = 'spin 0.5s ease-in-out';
            
            // Add spinning animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg) scale(1); }
                    to { transform: rotate(360deg) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
            
            // Show final warning
            setTimeout(() => {
                showNotification('You were warned! Redirecting to bug-infested light mode...', 'error');
            }, 250);
            
            // Redirect to 404 page after animation
            setTimeout(() => {
                window.location.href = '404.html';
            }, 1500);
        });
        
        // Add pulsing effect for attention
        setInterval(() => {
            lightModeToggle.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.5)';
            setTimeout(() => {
                lightModeToggle.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.3)';
            }, 500);
        }, 3000);
    }
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', preloadResources);
window.addEventListener('load', () => {
    // Trigger skill animation when about section is in view
    const aboutSection = document.getElementById('about');
    const aboutObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(animateSkills, 500);
            aboutObserver.disconnect();
        }
    });
    aboutObserver.observe(aboutSection);
});
