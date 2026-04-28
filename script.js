// ===== NAVBAR: scroll shrink + mobile toggle =====
(function () {
    const nav    = document.getElementById('main-nav');
    const burger = document.getElementById('nav-hamburger');
    const overlay= document.getElementById('nav-mobile-overlay');

    // Scroll: add/remove .scrolled class
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Mobile hamburger toggle
    if (burger && overlay) {
        burger.addEventListener('click', () => {
            const isOpen = burger.classList.toggle('open');
            burger.setAttribute('aria-expanded', isOpen);
            overlay.classList.toggle('open', isOpen);
            overlay.style.display = isOpen ? 'block' : 'none';
        });

        // Close overlay when a link is clicked
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                burger.setAttribute('aria-expanded', false);
                overlay.classList.remove('open');
                overlay.style.display = 'none';
            });
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    // Select all sections to animate
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                // Optional: Stop observing once visible to run only once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('hidden-section');
        sectionObserver.observe(section);
    });

    // Simple smooth scroll link handling if needed (mostly native css handles this)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle hash navigation on page load (for external links)
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
});

// ===== CONTACT FORM =====
(function () {
    const form      = document.getElementById('contact-form');
    const success   = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic validation — highlight empty required fields
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
            field.style.borderColor = '';
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                valid = false;
            }
        });

        if (!valid) return;

        // Simulate send (replace with fetch/emailjs for production)
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Enviar mensaje';
            success.classList.add('visible');
            setTimeout(() => success.classList.remove('visible'), 5000);
        }, 1000);
    });
})();

