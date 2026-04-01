// Main JavaScript for Caldén Elevaciones website

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        offset: 100
    });
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and submission for contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectType = document.getElementById('projectType').value;
            const material = document.getElementById('material').value;
            const floors = document.getElementById('floors').value;
            const weight = document.getElementById('weight').value;
            const location = document.getElementById('location').value.trim();
            const terms = document.getElementById('terms').checked;
            
            if (!name || !phone || !email || !projectType || !material || !floors || !weight || !location || !terms) {
                showFormMessage('Por favor, completa todos los campos obligatorios (*).', 'danger');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Por favor, introduce un email válido.', 'danger');
                return;
            }
            
            // If all validations pass, submit the form (in a real scenario, this would be to Google Sheets)
            showFormMessage('Enviando solicitud...', 'info');
            
            // Simulate form submission
            setTimeout(() => {
                // In a real implementation, this would submit to Google Sheets via gs.js
                // For now, we'll show a success message
                showFormMessage('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo a la brevedad.', 'success');
                contactForm.reset();
                
                // In a real implementation, you would call the function from gs.js here
                // submitToGoogleSheets(formData);
            }, 1500);
        });
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = 'mt-3 text-center';
        
        if (type === 'success') {
            formMessage.classList.add('text-success');
            formMessage.classList.add('fw-bold');
        } else if (type === 'danger') {
            formMessage.classList.add('text-danger');
        } else if (type === 'info') {
            formMessage.classList.add('text-info');
        }
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'mt-3 text-center';
            }, 5000);
        }
    }
    
    // Developer link functionality
    const developerLink = document.getElementById('developer-link');
    if (developerLink) {
        developerLink.addEventListener('click', function(e) {
            // In a real implementation, this would link to your portfolio
            // For demonstration, we'll just log and prevent default
            console.log('Navigating to Kevin Luna portfolio');
            // e.preventDefault(); // Uncomment this to prevent navigation during testing
        });
    }
    
    // Gallery image loading optimization
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        // Add loading lazy attribute for better performance
        img.setAttribute('loading', 'lazy');
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            this.alt = 'Imagen de elevaciones de materiales de construcción';
        });
    });
});