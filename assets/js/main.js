/* ============================================
   Говядо — Production JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation
    // ============================================
    const navToggle = document.querySelector('.nav__toggle');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link');
    const backdrop = document.querySelector('.nav__backdrop');

    if (navToggle && header) {
        navToggle.addEventListener('click', function() {
            header.classList.toggle('nav--open');
            document.body.style.overflow = header.classList.contains('nav--open') ? 'hidden' : '';
        });

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                header.classList.remove('nav--open');
                document.body.style.overflow = '';
            });
        });

        // Клик по размытому фону также закрывает меню
        if (backdrop) {
            backdrop.addEventListener('click', function() {
                header.classList.remove('nav--open');
                document.body.style.overflow = '';
            });
        }
    }

    // ============================================
    // Header scroll effect
    // ============================================
    const headerEl = document.querySelector('.header');
    let ticking = false;

    function updateHeader() {
        const scrollY = window.pageYOffset;
        if (scrollY > 60) {
            headerEl.classList.add('header--scrolled');
        } else {
            headerEl.classList.remove('header--scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ============================================
    // Hero fire fade-out on scroll
    // ============================================
    const fireWrapper = document.querySelector('.hero__fire-wrapper');
    const hero = document.querySelector('.hero');

    if (fireWrapper && hero) {
        function updateFireOpacity() {
            const scrollY = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            const progress = Math.min(scrollY / (heroHeight * 0.6), 1);
            fireWrapper.style.opacity = 1 - progress;
            fireWrapper.style.transform = 'scale(' + (1 + progress * 0.15) + ')';
        }

        window.addEventListener('scroll', function() {
            requestAnimationFrame(updateFireOpacity);
        });
    }

    // ============================================
    // Smooth scroll for anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Intersection Observer — fade-in animations
    // ============================================
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.08
    });

    const animElements = document.querySelectorAll(
        '.menu__table-wrapper, .about__feature, .contacts__item, .contacts__map, .gallery__slider'
    );

    animElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        fadeObserver.observe(el);
    });

    // CSS class trigger
    const style = document.createElement('style');
    style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ============================================
    // Gallery Slider
    // ============================================
    const galleryTrack = document.querySelector('.gallery__track');
    const gallerySlides = document.querySelectorAll('.gallery__slide');
    const prevBtn = document.querySelector('.gallery__btn--prev');
    const nextBtn = document.querySelector('.gallery__btn--next');
    const dotsContainer = document.querySelector('.gallery__dots');

    if (galleryTrack && gallerySlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = gallerySlides.length;
        let autoPlayInterval;

        // Create dots
        gallerySlides.forEach(function(_, index) {
            const dot = document.createElement('button');
            dot.className = 'gallery__dot' + (index === 0 ? ' gallery__dot--active' : '');
            dot.setAttribute('aria-label', 'Перейти к слайду ' + (index + 1));
            dot.addEventListener('click', function() {
                goToSlide(index);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.gallery__dot');

        function updateSlider() {
            galleryTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            dots.forEach(function(dot, index) {
                dot.classList.toggle('gallery__dot--active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            updateSlider();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoPlay();
            });
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        const galleryViewport = document.querySelector('.gallery__viewport');

        if (galleryViewport) {
            galleryViewport.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            galleryViewport.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetAutoPlay();
                }
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            const gallerySection = document.getElementById('gallery');
            if (!gallerySection) return;
            const rect = gallerySection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoPlay();
                }
            }
        });

        startAutoPlay();
    }

    // ============================================
    // Active nav link on scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset + 120;
        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector('.nav__link[href="#' + id + '"]');
            if (link && scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function(l) { l.classList.remove('nav__link--active'); });
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', function() {
        requestAnimationFrame(updateActiveNav);
    });

    // ============================================
    // Interactive Map Overlay
    // ============================================
    const mapContainer = document.querySelector('.contacts__map');
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            this.classList.add('contacts__map--interactive');
        });

        document.addEventListener('click', function(e) {
            if (!mapContainer.contains(e.target)) {
                mapContainer.classList.remove('contacts__map--interactive');
            }
        });
    }

})();