// Assetmarkle Custom JavaScript

// Initialize data layer for Google Analytics
window.dataLayer = window.dataLayer || [];

// WebFont Configuration
WebFont.load({
    google: {
        families: ["Roboto Mono:regular", "Roboto Mono:500"]
    }
});

// Webflow touch detection
!function(o, c) {
    var n = c.documentElement, t = " w-mod-";
    n.className += t + "js";
    ("ontouchstart" in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch");
}(window, document);

// User Country Detection and Cookie Consent
let userCountry = localStorage.getItem('userCountry');
const euCountries = new Set([
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
    "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
    "SE", "IS", "LI", "NO", "GB"
]);

function checkIsEUCountry(geoCountry) {
    if (!geoCountry) return false;
    return euCountries.has(geoCountry);
}

async function getUserCountry() {
    let geoCountry = localStorage.getItem('userCountry');

    if (!geoCountry) {
        try {
            const response = await fetch('https://ipinfo.io/json?token=4f0ee6fb59c3d1');
            const data = await response.json();
            geoCountry = data.country || null;

            if (geoCountry) {
                localStorage.setItem('userCountry', geoCountry);
            } else {
                return false;
            }
        } catch (error) {
            console.error('Failed to fetch user country:', error);
            return false;
        }
    }

    return geoCountry;
}

function scriptEUModalPopup() {
    let storageCookieName = 'userCookieSetting';
    let userCookieModel = localStorage.getItem(storageCookieName);
    if (userCookieModel === null) {
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'personalization_storage': 'denied',
            'functionality_storage': 'denied',
            'security_storage': 'denied',
        });
    } else {
        gtag('consent', 'update', {
            "ad_storage": userCookieModel.marketing ? 'granted' : 'denied',
            "ad_user_data": userCookieModel.marketing ? 'granted' : 'denied',
            "ad_personalization": userCookieModel.marketing ? 'granted' : 'denied',
            "analytics_storage": userCookieModel.statistics ? 'granted' : 'denied',
            "functionality_storage": userCookieModel.preferences ? 'granted' : 'denied',
            "personalization_storage": userCookieModel.marketing ? 'granted' : 'denied',
            "security_storage": "granted",
        });
    }
}

function scriptDefauldModalPopup() {
    if (localStorage.getItem('consentMode') === null) {
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'personalization_storage': 'denied',
            'functionality_storage': 'denied',
            'security_storage': 'denied',
        });
    } else {
        gtag('consent', 'default', JSON.parse(localStorage.getItem('consentMode')));
    }
}

function gtag() {
    dataLayer.push(arguments);
}

// Initialize consent based on user location
console.log(window.location.origin);
if (window.location.origin == 'https://chain-gpt.webflow.io') {
    if (userCountry === null) {
        console.log('line 87');
        (async () => {
            const country = await getUserCountry();
            const isEU = checkIsEUCountry(country);
            localStorage.setItem('userCountry', country);
            console.log('isEU', isEU);
            if (isEU) {
                scriptEUModalPopup();
            } else {
                scriptDefauldModalPopup();
            }
        })();
    } else {
        console.log('line 100', checkIsEUCountry(userCountry));
        if (checkIsEUCountry(userCountry)) {
            scriptEUModalPopup();
        } else {
            scriptDefauldModalPopup();
        }
    }
} else {
    if (localStorage.getItem('consentMode') === null) {
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'personalization_storage': 'denied',
            'functionality_storage': 'denied',
            'security_storage': 'denied',
        });
    } else {
        gtag('consent', 'default', JSON.parse(localStorage.getItem('consentMode')));
    }
}

// Google Tag Manager
(function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-K43K2ZQ');

// Page initialization and animation handling
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body after page load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Animation trigger observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation triggers
    document.querySelectorAll('[anim-trigger]').forEach(el => {
        animationObserver.observe(el);
    });

    // Form label animation
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('label-moved');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('label-moved');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('label-moved');
        }
    });

    // FAQ accordion functionality
    document.querySelectorAll('.faq-2 .miscellaneous-2').forEach(item => {
        item.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const plusWrap = this.querySelector('.plus-wrap-2');
            
            if (this.getAttribute('aria-selected') === 'true') {
                this.setAttribute('aria-selected', 'false');
                answer.style.maxHeight = '0';
                plusWrap.classList.remove('rotate');
            } else {
                // Close all other items
                document.querySelectorAll('.faq-2 .miscellaneous-2').forEach(otherItem => {
                    otherItem.setAttribute('aria-selected', 'false');
                    otherItem.nextElementSibling.style.maxHeight = '0';
                    otherItem.querySelector('.plus-wrap-2').classList.remove('rotate');
                });
                
                this.setAttribute('aria-selected', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                plusWrap.classList.add('rotate');
            }
        });
    });

    // Top banner close functionality
    const topBannerClose = document.querySelector('.top-banner__close-btn');
    if (topBannerClose) {
        topBannerClose.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.top-banner').classList.add('hidden');
            document.body.classList.add('no-top-banner');
        });
    }

    // Mobile menu toggle
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.querySelector('.w-nav-overlay');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            document.body.classList.toggle('nav-open');
        });
    }
});

// Hero slider functionality
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 1) {
            this.showSlide(0);
            this.startAutoSlide();
        }
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Initialize hero slider when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.hero-slide')) {
        new HeroSlider();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied to clipboard!');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// YouTube video embed handling
document.addEventListener('click', function(e) {
    const youtubeVideo = e.target.closest('.youtube-video');
    if (youtubeVideo) {
        const videoId = youtubeVideo.dataset.videoId;
        if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.allowFullscreen = true;
            
            youtubeVideo.innerHTML = '';
            youtubeVideo.appendChild(iframe);
        }
    }
});

// Intersection Observer for lazy loading and animations
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            observer.unobserve(img);
        }
    });
});

// Observe all images with data-src for lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
    lazyImageObserver.observe(img);
});

// Resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle responsive updates here
        handleResponsiveUpdates();
    }, 250);
});

function handleResponsiveUpdates() {
    // Update slider arrow positions
    const sliderArrows = document.querySelectorAll('.custom-slider-arrow');
    sliderArrows.forEach(arrow => {
        // Responsive adjustments would go here
    });
    
    // Update mobile menu state
    if (window.innerWidth > 991) {
        document.body.classList.remove('nav-open');
    }
}

// Canvas and Rive.js animations handling
const riveInstances = [];
const activeArtboards = [];
const MAX_DPR = 2;

document.addEventListener('DOMContentLoaded', function() {
    const riveCanvases = document.querySelectorAll('canvas[data-rive-src]');
    
    riveCanvases.forEach((canvas, index) => {
        const container = canvas.parentElement;
        const config = {
            artboard: canvas.dataset.artboard || 'default',
            src: canvas.dataset.riveSrc
        };
        
        function initRiveInstance(canvas, container, config, updateFunction, index) {
            // This would initialize Rive.js instance
            // Placeholder for actual Rive.js implementation
            console.log('Initializing Rive instance:', config);
            
            activeArtboards[index] = config.artboard;
            
            // Simulated Rive instance
            riveInstances[index] = {
                resizeDrawingSurfaceToCanvas: updateFunction,
                cleanup: () => {
                    console.log('Cleaning up Rive instance');
                }
            };
        }
        
        const updateCanvasDimensions = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            
            if (riveInstances[index]) {
                riveInstances[index].resizeDrawingSurfaceToCanvas();
            }
        };
        
        initRiveInstance(canvas, container, config, updateCanvasDimensions, index);
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        riveInstances.forEach(instance => {
            if (instance) {
                instance.cleanup();
            }
        });
    });
});

// Debounced resize handler for canvas updates
const debouncedCanvasUpdate = debounce(() => {
    riveInstances.forEach((instance, index) => {
        const canvas = document.querySelectorAll('canvas[data-rive-src]')[index];
        if (canvas && instance) {
            const container = canvas.parentElement;
            const config = {
                artboard: canvas.dataset.artboard || 'default'
            };
            
            const activeConfig = {
                artboard: activeArtboards[index]
            };
            
            const updateCanvasDimensions = () => {
                const rect = container.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
                canvas.width = Math.round(rect.width * dpr);
                canvas.height = Math.round(rect.height * dpr);
                
                if (riveInstances[index]) {
                    riveInstances[index].resizeDrawingSurfaceToCanvas();
                }
            };
            
            if (activeArtboards[index] !== activeConfig.artboard) {
                // Force recreation when artboard changes
                console.log('Recreating Rive instance for artboard change');
            } else {
                // Same artboard, just update dimensions
                updateCanvasDimensions();
            }
        }
    });
}, 250);

// Utility function for debouncing
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add resize listener for canvas updates
window.addEventListener('resize', debouncedCanvasUpdate);

// Theme and mode switching
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
            console.log('CLS:', entry.value);
        }
    });
});

// Observe performance metrics
try {
    performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
} catch (e) {
    console.log('Performance Observer not supported');
}

// Error handling and logging
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an analytics service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an analytics service
});

// Export functions for global access
window.Assetmarkle = {
    copyToClipboard,
    showNotification,
    toggleTheme,
    HeroSlider
};
