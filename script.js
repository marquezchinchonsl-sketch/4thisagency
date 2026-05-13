document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileOverlay = document.getElementById('nav-mobile-overlay');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');

    // 1. Scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const toggleMenu = () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // 3. Contact Form Handling (Simple demonstration)
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate submission
            const btn = document.getElementById('form-submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                successMsg.style.display = 'block';
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // 4. Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('reveal-on-scroll');
        observer.observe(section);
    });
});
