// Основные переменные
const scrollProgress = document.getElementById('scrollProgress');
const navContainer = document.getElementById('navContainer'); 
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const backToTopBtn = document.getElementById('backToTop');
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Загрузочный экран с отслеживанием ресурсов
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderPercentage = document.querySelector('.loader-percentage');
    const canvas = document.getElementById('loaderCanvas');
    
    if (!preloader || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    let loadProgress = 0;
    let resourcesLoaded = 0;
    let totalResources = 0;
    let animationId;
    let particles = [];
    
    // Настройка canvas
    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });
    }
    
    // Инициализация частиц
    function initParticles() {
        particles = [];
        const particleCount = 250;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                targetX: getTargetPosition(i).x,
                targetY: getTargetPosition(i).y,
                vx: 0,
                vy: 0,
                size: Math.random() * 3 + 1,
                color: getRandomColor(),
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    // Получить целевую позицию для частицы (формирование букв M и I)
    function getTargetPosition(index) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 - 100;
        
        if (index < 125) {
            // Буква M
            const mWidth = 120;
            const mHeight = 160;
            const mLeft = centerX - 80;
            
            if (index < 30) {
                // Левая вертикальная линия
                return {
                    x: mLeft + Math.random() * 8,
                    y: centerY + Math.random() * mHeight
                };
            } else if (index < 60) {
                // Правая вертикальная линия
                return {
                    x: mLeft + mWidth - Math.random() * 8,
                    y: centerY + Math.random() * mHeight
                };
            } else if (index < 90) {
                // Диагональная линия слева
                const progress = (index - 60) / 30;
                return {
                    x: mLeft + progress * 60,
                    y: centerY + progress * 80
                };
            } else {
                // Диагональная линия справа
                const progress = (index - 90) / 35;
                return {
                    x: mLeft + 60 - progress * 60,
                    y: centerY + progress * 80
                };
            }
        } else {
            // Буква I
            const iWidth = 20;
            const iHeight = 160;
            const iLeft = centerX + 20;
            
            if (index < 180) {
                // Вертикальная линия
                return {
                    x: iLeft + Math.random() * iWidth,
                    y: centerY + Math.random() * iHeight
                };
            } else if (index < 210) {
                // Верхняя горизонтальная линия
                return {
                    x: iLeft - 15 + Math.random() * 50,
                    y: centerY + Math.random() * 8
                };
            } else {
                // Нижняя горизонтальная линия
                return {
                    x: iLeft - 15 + Math.random() * 50,
                    y: centerY + iHeight - Math.random() * 8
                };
            }
        }
    }
    
    // Получить случайный корпоративный цвет
    function getRandomColor() {
        const colors = [
            '#2563eb', // корпоративный синий
            '#14b8a6', // бирюзовый
            '#6366f1'  // индиго
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Анимация частиц
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Движение к целевой позиции
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 2) {
                particle.vx += dx * 0.01;
                particle.vy += dy * 0.01;
                particle.vx *= 0.95;
                particle.vy *= 0.95;
                
                particle.x += particle.vx;
                particle.y += particle.vy;
            }
            
            // Рисование частицы
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Обновление прогресса
    function updateProgress(percent) {
        loadProgress = Math.min(100, Math.max(0, percent));
        loaderBar.style.width = loadProgress + '%';
        loaderPercentage.textContent = Math.round(loadProgress) + '%';
    }
    
    // Отслеживание загрузки ресурсов - УПРОЩЕННАЯ ВЕРСИЯ
    function trackResourceLoading() {
        const startTime = Date.now();
        const minShowTime = 2000; // 2 секунды
        const maxShowTime = 3000; // 3 секунды максимум
        let isCompleted = false;
        
        // Упрощенная проверка загрузки
        function checkLoadStatus() {
            const images = document.querySelectorAll('img');
            const cssSheets = document.querySelectorAll('link[rel="stylesheet"]');
            
            let allImagesLoaded = true;
            let allCssLoaded = true;
            
            // Проверяем изображения
            images.forEach(img => {
                if (!img.complete || img.naturalWidth === 0) {
                    allImagesLoaded = false;
                }
            });
            
            // Проверяем CSS
            cssSheets.forEach(link => {
                if (!link.sheet) {
                    allCssLoaded = false;
                }
            });
            
            return allImagesLoaded && allCssLoaded;
        }
        
        // Плавное увеличение прогресса
        function updateProgressSmooth() {
            const elapsed = Date.now() - startTime;
            const progressPercent = Math.min(95, (elapsed / minShowTime) * 100);
            updateProgress(progressPercent);
            
            if (elapsed < maxShowTime && !isCompleted) {
                requestAnimationFrame(updateProgressSmooth);
            } else if (!isCompleted) {
                completeLoading();
            }
        }
        
        // Завершение загрузки
        function completeLoading() {
            if (isCompleted) return;
            isCompleted = true;
            
            updateProgress(100);
            
            setTimeout(() => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                preloader.classList.add('preloader-hidden');
                
                // Удаление элемента через 1 секунду
                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 1000);
            }, 500);
        }
        
        // Проверяем статус загрузки каждые 200мс
        function checkResources() {
            if (isCompleted) return;
            
            const elapsed = Date.now() - startTime;
            
            if (checkLoadStatus() && elapsed >= minShowTime) {
                completeLoading();
            } else if (elapsed >= maxShowTime) {
                // Принудительное завершение через 3 секунды
                completeLoading();
            } else {
                setTimeout(checkResources, 200);
            }
        }
        
        // Запускаем проверки
        updateProgressSmooth();
        checkResources();
    }
    
    // Инициализация
    setupCanvas();
    initParticles();
    animateParticles();
    
    // Запуск отслеживания загрузки после небольшой задержки
    setTimeout(trackResourceLoading, 100);
})();



// Scroll indicator, навигация и кнопка "Вверх"
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    // Прогрессбар + ARIA
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
        scrollProgress.setAttribute('aria-valuenow', String(Math.round(scrolled)));
    }
    
    // Навбар при прокрутке
    const nav = document.querySelector('nav');
    if (nav) {
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    // Появление кнопки Вверх
    if (backToTopBtn) {
        if (scrollTop > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
});

// Fade in animation с Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Применяем observer ко всем элементам с классом fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Новая система скролла
let isScrolling = false;
let currentSection = 'home';

// Функция для плавной прокрутки к секции
function smoothScrollTo(targetId) {
    if (isScrolling) return;
    
    isScrolling = true;
    currentSection = targetId.replace('#', '');
    
    console.log('Scrolling to:', targetId);
    
    // Закрываем мобильное меню если оно открыто
    if (navContainer && navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    if (targetId === '#home') {
        // Прокрутка наверх
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function для плавности
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
                updateActiveNav('home');
            }
        }
        
        requestAnimationFrame(animation);
    } else {
        // Прокрутка к конкретной секции
        const target = document.querySelector(targetId);
        if (target) {
            const startPosition = window.pageYOffset;
            const targetPosition = target.offsetTop;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function для плавности
                const ease = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    isScrolling = false;
                    updateActiveNav(targetId.replace('#', ''));
                }
            }
            
            requestAnimationFrame(animation);
        } else {
            isScrolling = false;
        }
    }
}

// Функция для обновления активной навигации
function updateActiveNav(sectionId) {
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Инициализация навигации
function initNavigation() {
    document.querySelectorAll('nav a[href^="#"], .hero-buttons a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
}

// Кнопка Вверх
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#home');
    });
}

// Новая система scrollspy
let scrollTimeout;
let isUserScrolling = false;

// Функция для определения активной секции при скролле
function updateActiveSectionOnScroll() {
    if (isScrolling) return; // Не обновляем во время программного скролла
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    
    let activeSection = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Проверяем, находимся ли мы в самом верху страницы
    if (window.pageYOffset < 100) {
        activeSection = 'home';
    }
    
    if (activeSection !== currentSection) {
        currentSection = activeSection;
        updateActiveNav(activeSection);
    }
}

// Обработчик скролла с дебаунсингом
function handleScroll() {
    isUserScrolling = true;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateActiveSectionOnScroll();
        isUserScrolling = false;
    }, 100);
}

// Добавляем обработчик скролла
window.addEventListener('scroll', handleScroll, { passive: true });

// Эффект параллакса при движении мыши (rAF + отключение на тач/мобильных/при reduce motion)
(function setupParallax(){
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || prefersReducedMotion || window.innerWidth < 1024) return;
    let pending = false;
    let lastX = 0, lastY = 0;
    document.addEventListener('mousemove', (e) => {
        lastX = (e.clientX / window.innerWidth - 0.5) * 2;
        lastY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            const avatar = document.querySelector('.hero-avatar');
            if (avatar) {
                avatar.style.transform = `translateX(${lastX * 10}px) translateY(${lastY * 10}px)`;
            }
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const depth = (index + 1) * 5;
                element.style.transform = `translateX(${lastX * depth}px) translateY(${lastY * depth}px)`;
            });
            
            // Интерактивность с анимированными фигурами
            document.querySelectorAll('.shape').forEach((shape, index) => {
                const depth = (index + 1) * 3;
                const parallaxX = lastX * depth;
                const parallaxY = lastY * depth;
                shape.style.transform += ` translate(${parallaxX}px, ${parallaxY}px)`;
            });
            
            // Интерактивность с геометрическими элементами
            document.querySelectorAll('.geo-element').forEach((geo, index) => {
                const depth = (index + 1) * 2;
                const parallaxX = lastX * depth;
                const parallaxY = lastY * depth;
                geo.style.transform += ` translate(${parallaxX}px, ${parallaxY}px)`;
            });
            
            pending = false;
        });
    });
})();

// Интерактивные эффекты для анимированных фигур - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
(function setupInteractiveShapes() {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    
    let isMouseMoving = false;
    let mouseMoveTimeout;
    
    // Эффект следования за курсором с дебаунсингом
    document.addEventListener('mousemove', (e) => {
        if (isMouseMoving) return;
        
        clearTimeout(mouseMoveTimeout);
        isMouseMoving = true;
        
        requestAnimationFrame(() => {
            const shapes = document.querySelectorAll('.shape:not(:hover), .geo-element:not(:hover)');
            shapes.forEach((shape, index) => {
                const rect = shape.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
                );
                
                if (distance < 200) {
                    const intensity = Math.max(0, (200 - distance) / 200);
                    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                    const offsetX = Math.cos(angle) * intensity * 8;
                    const offsetY = Math.sin(angle) * intensity * 8;
                    
                    shape.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    shape.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + intensity * 0.05})`;
                } else {
                    shape.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    shape.style.transform = '';
                }
            });
            
            isMouseMoving = false;
        });
        
        mouseMoveTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 50);
    });
    
    // Эффект пульсации при клике
    document.addEventListener('click', (e) => {
        const shapes = document.querySelectorAll('.shape, .geo-element');
        shapes.forEach(shape => {
            const rect = shape.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
            );
            
            if (distance < 200) {
                shape.style.animation = 'none';
                shape.offsetHeight; // Принудительный reflow
                shape.style.animation = shape.style.animation || 'morphingCircle1 20s ease-in-out infinite';
                
                // Эффект волны
                shape.style.filter = 'brightness(1.5) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))';
                setTimeout(() => {
                    shape.style.filter = '';
                }, 500);
            }
        });
    });
})();

// Интерактивные эффекты для карточек
document.querySelectorAll('.skill-card, .feature-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform += ' scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = card.style.transform.replace(' scale(1.02)', '');
    });
});

// === МОДАЛЬНЫЕ ОКНА - ИСПРАВЛЕННАЯ ВЕРСИЯ ===

// Функции для телефонного модального окна
function openPhoneModal(event) {
    event.preventDefault();
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.style.display = 'flex';
        // Небольшая задержка для плавной анимации
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Функции для email модального окна
function openEmailModal(event) {
    event.preventDefault();
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Закрытие модальных окон при клике на крестик
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем навигацию сразу после загрузки DOM
    initNavigation();
    
    // Устанавливаем начальную активную секцию
    updateActiveNav('home');
    
    // Обработчики для кнопок закрытия
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
    
    // Закрытие при клике вне модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        }
    });
});

// Мобильное меню
if (mobileMenuBtn && navContainer) {
    // Обработчик клика по кнопке мобильного меню
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        navContainer.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Добавляем/убираем класс для body чтобы предотвратить скролл
        document.body.classList.toggle('menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', mobileMenuBtn.classList.contains('active') ? 'true' : 'false');
    });
    // Активация по Enter/Space
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenuBtn.click();
        }
    });
    
    // Закрытие мобильного меню при клике на навигационную ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        // Проверяем, что клик был не по кнопке меню и не по самому меню
        if (!navContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Закрытие меню при изменении размера экрана (переход на десктоп)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Desktop toggle for sidebar nav using same button
(function setupDesktopNavToggle(){
    if (!mobileMenuBtn || !navContainer) return;
    const mqDesktop = window.matchMedia('(min-width: 769px)');

    function applyDesktopState() {
        if (mqDesktop.matches) {
            // На десктопе кнопка управляет классом is-hidden у боковой панели
            mobileMenuBtn.setAttribute('aria-label', navContainer.classList.contains('is-hidden') ? 'Открыть меню' : 'Скрыть меню');
            mobileMenuBtn.setAttribute('aria-expanded', navContainer.classList.contains('is-hidden') ? 'false' : 'true');
        }
    }

    // Клик по кнопке: если десктоп — переключаем is-hidden, если мобильный — как раньше (active)
    mobileMenuBtn.addEventListener('click', () => {
        if (mqDesktop.matches) {
            navContainer.classList.toggle('is-hidden');
            // Убираем мобильные классы во избежание конфликтов
            navContainer.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.classList.toggle('active');
            applyDesktopState();
        }
    });

    // При изменении размера экрана — сбрасываем состояния корректно
    mqDesktop.addEventListener('change', () => {
        if (mqDesktop.matches) {
            // Входим в десктоп: закрываем мобильное, оставляем текущее is-hidden как есть
            navContainer.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.classList.remove('active');
        } else {
            // Входим в мобильный: показываем панель (без is-hidden), управляем классом active
            navContainer.classList.remove('is-hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
        applyDesktopState();
    });

    // Первичная инициализация
    applyDesktopState();
})();


// Эффект печатающегося текста для заголовка
function typeWriter(element, text, speed = 100, delay = 1000) {
    setTimeout(() => {
        let i = 0;
        const originalText = text;
        element.textContent = '';
        
        function type() {
            if (i < originalText.length) {
                element.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }, delay);
}

// Новый эффект - пульсирующие карточки
function addPulseEffect() {
    document.querySelectorAll('.feature-card, .project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('pulse-animation');
    });
}

// Добавляем CSS для пульсирующей анимации
const pulseCSS = `
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.pulse-animation {
    animation: pulse 3s ease-in-out infinite;
}

.pulse-animation:hover {
    animation-play-state: paused;
}
`;

// Вставляем CSS в head
const style = document.createElement('style');
style.textContent = pulseCSS;
document.head.appendChild(style);

// Применяем эффект печатающегося текста к заголовку
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100, 500);
    }
    
    // Инициализируем навигацию
    initNavigation();
    
    // Дополнительная инициализация навигации для надежности
    setTimeout(() => {
        initNavigation();
    }, 100);
    
    // Добавляем пульсирующий эффект к карточкам
    setTimeout(() => {
        addPulseEffect();
    }, 2000);
    
    // Добавляем интерактивный эффект для аватара
    const avatar = document.querySelector('.hero-avatar');
    if (avatar) {
        avatar.addEventListener('click', () => {
            avatar.style.animation = 'none';
            avatar.offsetHeight; // Принудительный reflow
            avatar.style.animation = 'heroFloat 6s ease-in-out infinite';
            
            // Добавляем эффект "взрыва" частиц
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createParticle();
                }, i * 100);
            }
        });
    }
});

// Создание анимированных частиц (с ограничением количества и паузой при скрытии вкладки)
let particleCount = 0;
const MAX_PARTICLES = 60;
let particleIntervalId = null;

function createParticle() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    if (prefersReducedMotion) return;
    if (particleCount >= MAX_PARTICLES) return;
    
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 2;
    
    // Корпоративные цвета для частиц
    const colors = [
        'rgba(37, 99, 235, 0.6)',
        'rgba(20, 184, 166, 0.6)', 
        'rgba(99, 102, 241, 0.6)',
        'rgba(30, 41, 59, 0.6)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        box-shadow: 0 0 10px ${color};
        animation: particleFloat ${duration}s linear infinite;
        animation-delay: ${delay}s;
    `;

    particlesContainer.appendChild(particle);
    particleCount++;

    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            particleCount = Math.max(0, particleCount - 1);
        }
    }, (duration + delay) * 1000);
}

// Создаем частицы периодически
function startParticles() {
    if (prefersReducedMotion) return;
    if (particleIntervalId) return;
    particleIntervalId = setInterval(createParticle, 400);
}
function stopParticles() {
    if (particleIntervalId) {
        clearInterval(particleIntervalId);
        particleIntervalId = null;
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopParticles(); else startParticles();
});
startParticles();

// Удален 3D эффект наклона для карточек проектов

// Анимация для таймлайна
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
    item.classList.add('fade-in');
});

// Обновление прогресса скролла с правильным ID
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    // Используем правильный ID из HTML
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
        progressBar.setAttribute('aria-valuenow', String(Math.round(scrolled)));
    }
}

window.addEventListener('scroll', updateScrollProgress);

// Простая функция для прокрутки наверх (резервный вариант)
function scrollToTop() {
    console.log('scrollToTop function called');
    smoothScrollTo('#home');
}

console.log('Portfolio script loaded successfully!');