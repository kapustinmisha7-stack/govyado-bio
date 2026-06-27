/* ============================================
   Говядо — Unified Production JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // Global Mobile Navigation
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

        if (backdrop) {
            backdrop.addEventListener('click', function() {
                header.classList.remove('nav--open');
                document.body.style.overflow = '';
            });
        }
    }

    // ============================================
    // Header Scroll Styling Transformer
    // ============================================
    const headerEl = document.querySelector('.header');
    let ticking = false;

    function updateHeader() {
        if (!headerEl) return;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 50) {
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
    }, { passive: true });

    // ============================================
    // Smooth Anchor Scroll Navigation
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
    // Smooth Intersection Observer Animations
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
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
    });

    const animElements = document.querySelectorAll(
        '.about__feature, .contacts__item, .contacts__map, .gallery__slider'
    );

    animElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        fadeObserver.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ============================================
    // Hardware-Accelerated Gallery Slider
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

        gallerySlides.forEach(function(_, index) {
            const dot = document.createElement('button');
            dot.className = 'gallery__dot' + (index === 0 ? ' gallery__dot--active' : '');
            dot.setAttribute('aria-label', 'Перейти к слайду ' + (index + 1));
            dot.addEventListener('click', function() {
                goToSlide(index);
                resetAutoPlay();
            });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.gallery__dot');

        function updateSlider() {
            galleryTrack.style.transform = 'translate3d(-' + (currentSlide * 100) + '%, 0, 0)';
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
                if (Math.abs(diff) > 40) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetAutoPlay();
                }
            }, { passive: true });
        }

        startAutoPlay();
    }

    // ============================================
    // Active Scroll Nav Tracker
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        sections.forEach(function(section) {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector('.nav__link[href="#' + id + '"]');
            if (link && scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav__link').forEach(function(l) { 
                    l.classList.remove('nav__link--active'); 
                });
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', function() {
        requestAnimationFrame(updateActiveNav);
    }, { passive: true });

    // ============================================
    // Pure Read-Only Menu Render Logic (Dodo-Style)
    // ============================================
    const menuTable = [
        {
            id: 'sh_classic',
            category: 'shawarma',
            title: 'Шаурма Классическая',
            description: 'Сочное мясо на углях, свежие огурцы, помидоры, капуста и фирменный белый соус в тонком лаваше.',
            image: 'assets/images/shawarma.png',
            variations: [
                { name: 'Курица', price: 270, image: 'assets/images/shawarma.png' },
                { name: 'Свинина', price: 320, image: 'assets/images/shawarma.png' },
                { name: 'Телятина', price: 340, image: 'assets/images/shawarma.png' }
            ]
        },
        {
            id: 'sh_xl',
            category: 'shawarma',
            title: 'Шаурма XL',
            description: 'Для настоящих богатырей: двойная порция сочного мяса на углях с овощами и соусом.',
            image: 'assets/images/xlshaurma.jpg',
            variations: [
                { name: 'Курица', price: 450, image: 'assets/images/xlshaurma.jpg' },
                { name: 'Свинина', price: 500, image: 'assets/images/xlshaurma.jpg' },
                { name: 'Телятина', price: 500, image: 'assets/images/xlshaurma.jpg' }
            ]
        },
        {
            id: 'sh_mini',
            category: 'shawarma',
            title: 'Шаурма Мини',
            description: 'Уменьшенная порция любимой шаурмы. Быстрый и легкий перекус.',
            image: 'assets/images/minishaurma.jpg',
            variations: [
                { name: 'Курица', price: 190, image: 'assets/images/minishaurma.jpg' },
                { name: 'Свинина', price: 210, image: 'assets/images/minishaurma.jpg' },
                { name: 'Говядина', price: 230, image: 'assets/images/minishaurma.jpg' }
            ]
        },
        {
            id: 'sh_shrimp',
            category: 'shawarma',
            title: 'Шаурма с креветками',
            description: 'Королевские креветки, свежие овощи, жареный лук фри и фирменный соус в армянском лаваше.',
            image: 'assets/images/shaurma-s-kerevtkami.webp',
            price: 350
        },
        {
            id: 'sh_arab',
            category: 'shawarma',
            title: 'Арабская в лепешке',
            description: 'Пышная лепешка с нежным мясом, свежими овощами и чесночным соусом.',
            image: 'assets/images/shawarma.png',
            variations: [
                { name: 'Курица', price: 350 },
                { name: 'Свинина', price: 400 },
                { name: 'Говядина', price: 400 }
            ]
        },
        {
            id: 'sh_lyulya',
            category: 'shawarma',
            title: 'Люля-кебаб',
            description: 'Ароматный люля-кебаб из нежного фарша со специями.',
            image: 'assets/images/lyulyakebab.webp',
            variations: [
                { name: 'В лаваше', price: 250, image: 'assets/images/lyulyakebab.webp' },
                { name: 'С овощами', price: 300, image: 'assets/images/kebab.png' }
            ]
        },
        {
            id: 'gr_turkish',
            category: 'grill',
            title: 'Шашлык по-турецки',
            description: 'Подается в лепешке — сочный шашлык с фирменным соусом и репчатым луком с зеленью.',
            image: 'assets/images/shashlukpoturecki.jpg',
            variations: [
                { name: 'Курица', price: 250 },
                { name: 'Люля', price: 280 },
                { name: 'Говядина', price: 300 }
            ]
        },
        {
            id: 'gr_classic',
            category: 'grill',
            title: 'Шашлык на углях',
            description: 'Классический, сочный шашлык. Подается с луком и в лаваше в комплекте.',
            image: 'assets/images/shashluk.webp',
            variations: [
                { name: 'Курица', price: 220 },
                { name: 'Свинина', price: 300 },
                { name: 'Телятина', price: 350 }
            ]
        },
        {
            id: 'gr_chicken',
            category: 'grill',
            title: 'Куры гриль',
            description: 'Цельная курица гриль с аппетитной хрустящей корочкой.',
            image: 'assets/images/chickengrill.jpg',
            price: 400
        },
        {
            id: 'sn_hotdog',
            category: 'snacks',
            title: 'Хот-дог',
            description: 'Горячая сосиска с огурчиком, кетчупом, горчицей и жареным луком фри.',
            image: 'assets/images/hotdog.webp',
            variations: [
                { name: 'Классический', price: 150 },
                { name: 'Двойной', price: 220 }
            ]
        },
        {
            id: 'sn_potato',
            category: 'snacks',
            title: 'Картофель',
            description: 'Хрустящий золотистый картофель со специями.',
            image: 'assets/images/potatofries.webp',
            variations: [
                { name: 'Фри', price: 150, image: 'assets/images/potatofries.webp' },
                { name: 'По-деревенски', price: 150, image: 'assets/images/ancientpotato.jpg' }
            ]
        },
        {
            id: 'sn_cheese',
            category: 'snacks',
            title: 'Сырные палочки',
            description: 'Тягучий сыр в хрустящей золотистой панировке.',
            image: 'assets/images/cheesesticks.jpg',
            price: 170
        },
        {
            id: 'sn_strips',
            category: 'snacks',
            title: 'Куриные стрипсы',
            description: 'Нежные кусочки куриного филе в хрустящей панировке.',
            image: 'assets/images/chickenstripes.jpg',
            price: 150
        },
        {
            id: 'sn_nuggets',
            category: 'snacks',
            title: 'Наггетсы',
            description: 'Классические куриные наггетсы — мягкие внутри, хрустящие снаружи.',
            image: 'assets/images/nuggets.jpg',
            price: 150
        },
        {
            id: 'sn_shrimps_klyar',
            category: 'snacks',
            title: 'Креветки в кляре',
            description: 'Обжаренные королевские креветки в нежном кляре.',
            image: 'assets/images/shrimpclar.jpeg',
            price: 250
        },
        {
            id: 'dr_soft',
            category: 'drinks',
            title: 'Освежающие напитки',
            description: 'Холодные газированные напитки, соки и чай в ассортименте.',
            image: 'assets/images/soft-dr.png',
            variations: [
                { name: 'Добрый 0.5л', price: 90 },
                { name: 'Rich Tea 0.5л', price: 90 },
                { name: 'Черноголовка 0.5л', price: 90 },
                { name: 'Pulpy 0.45л', price: 100 }
            ]
        },
        {
            id: 'dr_coffee',
            category: 'drinks',
            title: 'Кофе в ассортименте',
            description: 'Ароматнейшее зерновое кофе: эспрессо, американо, капучино, латте и эспрессо макиато. Сварено из отборных цельных зёрен.',
            image: 'assets/images/coffee.png',
            variations: [
                { name: 'Эспрессо', price: 80 },
                { name: 'Американо', price: 120 },
                { name: 'Капучино', price: 150 },
                { name: 'Латте', price: 180 },
                { name: 'Макиато', price: 200 }
            ]
        },
        {
            id: 'dr_tea',
            category: 'drinks',
            title: 'Чай с лимоном от Гринфилда',
            description: 'Ароматный горячий чай от Greenfield с добавлением сочного лимона.',
            image: 'assets/images/tea.png',
            price: 40
        }
    ];

    function renderMenuGrid(categoryFilter = 'all') {
        const grid = document.getElementById('menu-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = categoryFilter === 'all' 
            ? menuTable 
            : menuTable.filter(item => item.category === categoryFilter);

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';

            let selectedVarIndex = 0;
            let currentPrice = item.price ? item.price : item.variations[selectedVarIndex].price;
            let currentImage = item.price ? item.image : (item.variations[selectedVarIndex].image || item.image);

            let variationsHtml = '';
            if (item.variations && item.variations.length > 0) {
                variationsHtml = `<div class="card-variations">`;
                item.variations.forEach((v, index) => {
                    const activeClass = index === selectedVarIndex ? 'variation-btn--active' : '';
                    variationsHtml += `<button class="variation-btn ${activeClass}" data-index="${index}">${v.name}</button>`;
                });
                variationsHtml += `</div>`;
            }

            card.innerHTML = `
                <div class="menu-card__img-wrapper">
                    <img src="${currentImage}" alt="${item.title}" class="menu-card__img" loading="lazy">
                </div>
                <div class="menu-card__content">
                    <h3 class="menu-card__title">${item.title}</h3>
                    <p class="menu-card__desc">${item.description}</p>
                    ${variationsHtml}
                    <div class="menu-card__footer">
                        <div class="menu-card__price"><span class="price-val">${currentPrice}</span> ₽</div>
                        <div class="menu-card__badge">${item.category === 'shawarma' || item.category === 'grill' ? 'На углях 🔥' : 'Вкусно ✨'}</div>
                    </div>
                </div>
            `;

            // Обработка клика по кнопкам-вариациям (изменение цены и динамическая смена изображений)
            const varBtns = card.querySelectorAll('.variation-btn');
            const cardImg = card.querySelector('.menu-card__img');
            varBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    varBtns.forEach(b => b.classList.remove('variation-btn--active'));
                    btn.classList.add('variation-btn--active');
                    const index = parseInt(btn.getAttribute('data-index'));
                    
                    // Обновление цены
                    const newPrice = item.variations[index].price;
                    card.querySelector('.price-val').textContent = newPrice;

                    // Умная смена картинки (если у вариации прописано собственное изображение)
                    const specImage = item.variations[index].image;
                    if (specImage && cardImg) {
                        cardImg.style.opacity = '0';
                        setTimeout(() => {
                            cardImg.src = specImage;
                            cardImg.style.opacity = '1';
                        }, 150);
                    }
                });
            });

            grid.appendChild(card);
        });
    }

    // ============================================
    // Initialize Category Filters
    // ============================================
    const catButtons = document.querySelectorAll('.category-btn');
    if (catButtons.length > 0) {
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                catButtons.forEach(b => b.classList.remove('category-btn--active'));
                btn.classList.add('category-btn--active');
                const category = btn.getAttribute('data-category');
                renderMenuGrid(category);
            });
        });
    }

    // Initialize Menu Grid on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('menu-grid')) {
            renderMenuGrid('all');
        }
    });

})();