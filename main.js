// Основные переменные
const scrollProgress = document.getElementById('scrollProgress');
const navContainer = document.getElementById('navContainer'); 
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const backToTopBtn = document.getElementById('backToTop');
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;



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

// Smooth scrolling для навигационных ссылок (scrollIntoView + CSS scroll-margin-top)
document.querySelectorAll('nav a[href^="#"], .hero-buttons a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Кнопка Вверх
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Активная навигация (scrollspy) через IntersectionObserver
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { root: null, threshold: 0.6 });

sections.forEach(section => scrollSpyObserver.observe(section));

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
            pending = false;
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

// Применяем эффект печатающегося текста к заголовку
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100, 500);
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

    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 3;
    const delay = Math.random() * 2;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
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

// Эффект 3D наклона для карточек
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

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

console.log('Portfolio script loaded successfully!');