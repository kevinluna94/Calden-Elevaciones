// Google Sheets Integration for Caldén Elevaciones contact form
// This script handles form submission to Google Sheets

// Configuration
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_SCRIPT_URL'; // Replace with your Google Sheets script URL

// Function to submit form data to Google Sheets
function submitToGoogleSheets(formData) {
    // Create an object with form data
    const data = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        projectType: formData.projectType,
        material: formData.material,
        floors: formData.floors,
        weight: formData.weight,
        location: formData.location,
        message: formData.message || 'No message provided'
    };
    
    // In a real implementation, you would send this data to Google Sheets
    // using the Google Apps Script Web App URL
    
    // Example fetch request (uncomment and configure when you have your Google Sheets setup)
    /*
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Form data submitted to Google Sheets successfully');
        return true;
    })
    .catch(error => {
        console.error('Error submitting form data to Google Sheets:', error);
        return false;
    });
    */
    
    // For demonstration purposes, we'll just log the data
    console.log('Form data to submit to Google Sheets:', data);
    
    // Return a promise that simulates successful submission
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulated Google Sheets submission successful');
            resolve(true);
        }, 1000);
    });
}

// Function to handle contact form submission
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        projectType: document.getElementById('projectType').value,
        material: document.getElementById('material').value,
        floors: document.getElementById('floors').value,
        weight: document.getElementById('weight').value,
        location: document.getElementById('location').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'projectType', 'material', 'floors', 'weight', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
        alert('Por favor, completa todos los campos obligatorios.');
        return false;
    }
    
    // Submit to Google Sheets
    submitToGoogleSheets(formData)
        .then(success => {
            if (success) {
                // Show success message
                const formMessage = document.getElementById('formMessage');
                if (formMessage) {
                    formMessage.textContent = '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo a la brevedad.';
                    formMessage.className = 'mt-3 text-center text-success fw-bold';
                }
                
                // Reset form
                document.getElementById('contactForm').reset();
                
                // Scroll to form message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show error message
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.textContent = 'Hubo un error al enviar la solicitud. Por favor, intenta nuevamente o contacta directamente por teléfono.';
                formMessage.className = 'mt-3 text-center text-danger';
            }
        });
    
    return false;
}

// Initialize Google Sheets integration when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Remove any existing event listeners to avoid duplicates
        const newContactForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newContactForm, contactForm);
        
        // Add submit event listener
        newContactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Add instructions for setting up Google Sheets integration
    console.log('Google Sheets Integration Notes:');
    console.log('1. Create a Google Sheet to store form submissions');
    console.log('2. Create a Google Apps Script project linked to the sheet');
    console.log('3. Use the doPost() function in Apps Script to handle form submissions');
    console.log('4. Deploy the script as a Web App and set permissions');
    console.log('5. Update the GOOGLE_SHEETS_URL constant with your Web App URL');
});

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitToGoogleSheets,
        handleContactFormSubmit
    };
}