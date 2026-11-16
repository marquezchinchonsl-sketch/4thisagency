document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileOverlay = document.getElementById('nav-mobile-overlay');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');
    const progress = document.getElementById('scroll-progress');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setScrolled = () => {
        nav.classList.toggle('scrolled', window.scrollY > 24);
        if (progress) {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const value = height > 0 ? window.scrollY / height : 0;
            progress.style.transform = `scaleX(${value})`;
        }
    };

    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });

    const setMenu = (open) => {
        hamburger.classList.toggle('open', open);
        mobileOverlay.classList.toggle('open', open);
        nav.classList.toggle('menu-open', open);
        document.body.classList.toggle('menu-lock', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        mobileOverlay.setAttribute('aria-hidden', String(!open));
        const main = document.querySelector('main');
        if (main) main.inert = open;
        if (open) {
            const first = mobileOverlay.querySelector('a');
            if (first) first.focus();
        }
    };

    hamburger.addEventListener('click', () => {
        setMenu(!mobileOverlay.classList.contains('open'));
    });

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileOverlay.classList.contains('open')) {
            setMenu(false);
            hamburger.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 980 && mobileOverlay.classList.contains('open')) {
            setMenu(false);
        }
    });

    const hero = document.querySelector('.hero');
    const glow = document.getElementById('hero-glow');
    if (hero && glow && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            glow.style.transform = `translate(${event.clientX - rect.left - 220}px, ${event.clientY - rect.top - 220}px)`;
            glow.style.opacity = '1';
        });
        hero.addEventListener('pointerleave', () => {
            glow.style.opacity = '0';
        });
    }

    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const serviceSelect = document.getElementById('cf-service');

    document.querySelectorAll('[data-service]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (!serviceSelect) return;
            serviceSelect.value = trigger.getAttribute('data-service');
        });
    });

    const setFieldError = (field, message) => {
        const group = field.closest('.form-group');
        const error = group ? group.querySelector('.field-error') : null;
        if (!group || !error) return;
        if (message) {
            group.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            error.textContent = message;
        } else {
            group.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
            error.textContent = '';
        }
    };

    if (contactForm) {
        const requiredFields = ['cf-name', 'cf-email', 'cf-message'].map((id) => document.getElementById(id));

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            successMsg.classList.remove('is-visible');

            let firstInvalid = null;
            requiredFields.forEach((field) => {
                const value = field.value.trim();
                let message = '';
                if (!value) {
                    message = 'Este campo es obligatorio.';
                } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    message = 'Introduce un email válido.';
                }
                setFieldError(field, message);
                if (message && !firstInvalid) firstInvalid = field;
            });

            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            const button = document.getElementById('form-submit-btn');
            const original = button.innerHTML;
            button.innerHTML = 'Enviando...';
            button.disabled = true;

            window.setTimeout(() => {
                contactForm.reset();
                requiredFields.forEach((field) => setFieldError(field, ''));
                button.innerHTML = original;
                button.disabled = false;
                successMsg.classList.add('is-visible');
                window.setTimeout(() => successMsg.classList.remove('is-visible'), 6000);
            }, 900);
        });
    }

    if (!reducedMotion) {
        document.querySelectorAll('.phrase p, .quote').forEach((el) => {
            let index = 0;
            const splitNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const parts = node.textContent.split(/(\s+)/);
                    if (!parts.some((part) => part.trim())) return;
                    const fragment = document.createDocumentFragment();
                    parts.forEach((part) => {
                        if (!part) return;
                        if (!part.trim()) {
                            fragment.appendChild(document.createTextNode(part));
                            return;
                        }
                        const word = document.createElement('span');
                        word.className = 'word';
                        word.style.setProperty('--i', String(index));
                        index += 1;
                        word.textContent = part;
                        fragment.appendChild(word);
                    });
                    node.parentNode.replaceChild(fragment, node);
                    return;
                }
                if (node.nodeType === Node.ELEMENT_NODE) {
                    [...node.childNodes].forEach(splitNode);
                }
            };
            [...el.childNodes].forEach(splitNode);
            el.classList.add('split');
        });

        const finePointer = window.matchMedia('(pointer: fine)').matches;
        if (finePointer) {
            document.querySelectorAll('.plan, .pillar').forEach((card) => {
                card.addEventListener('pointermove', (event) => {
                    const rect = card.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    card.style.setProperty('--mx', `${x}px`);
                    card.style.setProperty('--my', `${y}px`);
                    const rotateX = ((y / rect.height) - 0.5) * -8;
                    const rotateY = ((x / rect.width) - 0.5) * 9;
                    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                });
                card.addEventListener('pointerleave', () => {
                    card.style.transform = '';
                });
            });

            document.querySelectorAll('.btn').forEach((button) => {
                button.addEventListener('pointermove', (event) => {
                    const rect = button.getBoundingClientRect();
                    const x = event.clientX - (rect.left + rect.width / 2);
                    const y = event.clientY - (rect.top + rect.height / 2);
                    button.style.transform = `translate(${x * 0.2}px, ${y * 0.28}px)`;
                });
                button.addEventListener('pointerleave', () => {
                    button.style.transform = '';
                });
            });
        }

        const heroEl = document.querySelector('.hero');
        const phraseEl = document.querySelector('.phrase');
        const performanceEl = document.querySelector('.performance');
        const track = document.querySelector('.marquee-track');
        let lastY = window.scrollY;
        let rate = 1;
        let frame = 0;

        const paint = () => {
            frame = 0;
            const y = window.scrollY;
            const delta = y - lastY;
            lastY = y;

            if (heroEl) {
                const rect = heroEl.getBoundingClientRect();
                const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
                const damp = window.innerWidth < 800 ? 0.45 : 1;
                heroEl.style.setProperty('--p', (progress * damp).toFixed(4));
            }

            if (phraseEl) {
                const rect = phraseEl.getBoundingClientRect();
                const passed = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const center = 1 - Math.min(1, Math.abs(Math.min(1, Math.max(0, passed)) - 0.5) * 2);
                phraseEl.style.setProperty('--p', center.toFixed(4));
            }

            if (track && typeof track.getAnimations === 'function') {
                const target = 1 + Math.min(1.8, Math.abs(delta) / 14);
                rate += (target - rate) * 0.18;
                const running = track.getAnimations()[0];
                if (running) running.playbackRate = rate;
            }
        };

        const requestPaint = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(paint);
        };

        paint();
        window.addEventListener('scroll', requestPaint, { passive: true });

        if (performanceEl && 'IntersectionObserver' in window) {
            const band = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-in');
                    band.unobserve(entry.target);
                });
            }, { threshold: 0.35 });
            band.observe(performanceEl);
        }
    }

    const revealNodes = document.querySelectorAll('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealNodes.forEach((node) => node.classList.add('is-in'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

        revealNodes.forEach((node) => observer.observe(node));
    }

    const spyTargets = ['pillars', 'services', 'intro', 'contacto']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if ('IntersectionObserver' in window && spyTargets.length) {
        const links = document.querySelectorAll('.nav-link, .nav-mobile-link');
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const hash = `#${entry.target.id}`;
                links.forEach((link) => {
                    const active = link.getAttribute('href') === hash;
                    link.classList.toggle('is-active', active);
                    if (active) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

        spyTargets.forEach((section) => spy.observe(section));
    }
});
