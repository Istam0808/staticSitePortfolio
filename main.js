// Scroll indicator
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    document.getElementById('scrollIndicator').style.width = scrolled + '%';
    
    // Добавляем класс для навигации при прокрутке
    if (scrollTop > 50) {
        document.querySelector('nav').classList.add('scrolled');
    } else {
        document.querySelector('nav').classList.remove('scrolled');
    }
    
    // Анимация секций при прокрутке
    document.querySelectorAll('.section').forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });
});

// Улучшенная анимация частиц
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 8 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 3;
    const delay = Math.random() * 2;
    const blur = Math.random() * 3;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    particle.style.filter = `blur(${blur}px)`;
    particle.style.opacity = Math.random() * 0.6 + 0.2;

    document.getElementById('particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Создаем больше частиц для лучшего эффекта
setInterval(createParticle, 200);

// Добавляем эффект параллакса при движении мыши
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    // Параллакс для аватара
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.style.transform = `translateX(${mouseX * 20}px) translateY(${mouseY * 20}px)`;
    }
    
    // Параллакс для карточек
    document.querySelectorAll('.skill-card, .feature-card').forEach(card => {
        const depth = Math.random() * 10 + 5;
        card.style.transform = `translateX(${mouseX * depth}px) translateY(${mouseY * depth}px)`;
    });
});

// Улучшенные модальные окна с анимацией
function openPhoneModal(event) {
    event.preventDefault();
    const modal = document.getElementById('phoneModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

document.querySelector('.close-modal').addEventListener('click', closePhoneModal);

// Улучшенное модальное окно для email
function openEmailModal(event) {
    event.preventDefault();
    const modal = document.getElementById('emailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
});

// Закрытие модальных окон при клике вне их области
window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
});

// Добавляем эффект печатающегося текста для заголовка
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
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100, 500);
    }
});

// Fade in animation
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

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Particles animation
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 3;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';

    document.getElementById('particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        const offsetTop = target.offsetTop - 80;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
});

// Add some interactive effects
document.querySelectorAll('.skill-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform += ' scale(1.05)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = card.style.transform.replace(' scale(1.05)', '');
    });
});

// Dynamic background effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    document.body.style.background = `linear-gradient(${mouseX * 360}deg, #667eea ${mouseY * 100}%, #764ba2 100%)`;
});

// Добавляем функционал модального окна
function openPhoneModal(event) {
    event.preventDefault();
    document.getElementById('phoneModal').style.display = 'flex';
}

// Закрытие модального окна при клике на крестик
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('phoneModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его области
window.addEventListener('click', (event) => {
    const modal = document.getElementById('phoneModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Функции для модального окна email
function openEmailModal(event) {
    event.preventDefault();
    document.getElementById('emailModal').style.display = 'flex';
}

function closeEmailModal() {
    document.getElementById('emailModal').style.display = 'none';
}

// Закрытие email модального окна при клике вне его области
window.addEventListener('click', (event) => {
    const emailModal = document.getElementById('emailModal');
    if (event.target === emailModal) {
        emailModal.style.display = 'none';
    }
});

// Обработка бургер-меню
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('nav');
const closeBurger = document.querySelector('.close-burger');

// Функция для переключения состояния меню
function toggleMenu() {
    // Переключаем класс active для бургер-меню и навигации
    burgerMenu.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Добавляем/удаляем класс active у кнопки закрытия,
    // при этом сохраняя класс close-burger
    if (burgerMenu.classList.contains('active')) {
        closeBurger.classList.add('active');
    } else {
        closeBurger.classList.remove('active');
    }
}

// Обработчик клика по бургер-меню
burgerMenu.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
});

// Закрытие меню при клике на пункт меню
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Закрытие меню при клике вне меню
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && 
        !e.target.closest('.burger-menu') && 
        !e.target.closest('nav')) {
        toggleMenu();
    }
});