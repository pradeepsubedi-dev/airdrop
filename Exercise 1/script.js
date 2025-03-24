// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll initialization
new SmoothScroll('a[href*="#"]', {
    speed: 800,
    speedAsDuration: true
});

// Add random movement to floating food items
const foodItems = document.querySelectorAll('.food-item');
foodItems.forEach(item => {
    item.style.animationDelay = `${Math.random() * 5}s`;
    item.style.fontSize = `${Math.random() * 20 + 20}px`;
});