// ==============================================
// GOOGLE SHEETS INTEGRATION - Form + Tracking
// ==============================================

// Endpoint del formulario (se mantiene el original)
const FORM_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_LOWf6OLuThESPZObGNSF4MfKXKtY6KvfKjXM8bEHJo8KslHCWTTKbog373PifqSVYw/exec';

// Enviar datos del formulario al Google Apps Script
async function submitToGoogleSheets(formData) {
    console.log('Sending form data...', formData);

    try {
        const dataToSend = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            projectType: formData.projectType,
            material: formData.material,
            floors: formData.floors,
            weight: formData.weight,
            location: formData.location,
            message: formData.message || '',
            timestamp: new Date().toISOString()
        };

        const proxyUrl = 'https://corsproxy.io/?';
        const fullUrl = proxyUrl + encodeURIComponent(FORM_APPS_SCRIPT_URL);

        const response = await fetch(fullUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const responseText = await response.text();

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (_err) {
            result = { success: true, message: 'Sent (non-JSON response).' };
        }

        if (response.ok || result.success) {
            return {
                success: true,
                message: 'Solicitud enviada con exito. Te contactaremos pronto.'
            };
        }

        throw new Error(result.message || 'Server error');
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);

        try {
            const altResult = await submitAlternativeMethod(formData);
            if (altResult.success) {
                return altResult;
            }
        } catch (altError) {
            console.error('Alternative submit failed:', altError);
        }

        return {
            success: false,
            message: 'Error de conexion. Contacta directamente al 1128064699.'
        };
    }
}

// Metodo alternativo usando FormSubmit.co
async function submitAlternativeMethod(formData) {
    const formSubmitUrl = 'https://formsubmit.co/ajax/info@caldenelevaciones.com';

    const formDataAlt = new FormData();
    formDataAlt.append('_subject', 'Nueva solicitud - Calden Elevaciones');
    formDataAlt.append('_template', 'table');
    formDataAlt.append('nombre', formData.name);
    formDataAlt.append('telefono', formData.phone);
    formDataAlt.append('email', formData.email);
    formDataAlt.append('tipo_proyecto', formData.projectType);
    formDataAlt.append('material', formData.material);
    formDataAlt.append('pisos', formData.floors);
    formDataAlt.append('peso', formData.weight);
    formDataAlt.append('ubicacion', formData.location);
    formDataAlt.append('mensaje', formData.message || '');

    const response = await fetch(formSubmitUrl, {
        method: 'POST',
        body: formDataAlt
    });

    const result = await response.json();
    console.log('Alternative submit success:', result);

    return {
        success: true,
        message: 'Solicitud enviada correctamente.'
    };
}

// Manejar envio del formulario
async function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        submitBtn.disabled = true;
    }

    const formData = {
        name: document.getElementById('name')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        projectType: document.getElementById('projectType')?.value || '',
        material: document.getElementById('material')?.value || '',
        floors: document.getElementById('floors')?.value || '',
        weight: document.getElementById('weight')?.value || '',
        location: document.getElementById('location')?.value.trim() || '',
        message: document.getElementById('message')?.value.trim() || ''
    };

    if (!validateFormData(formData)) {
        showFormMessage('Por favor, completa todos los campos obligatorios correctamente.', 'danger');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        return false;
    }

    const result = await submitToGoogleSheets(formData);
    showFormMessage(result.message, result.success ? 'success' : 'danger');

    if (result.success) {
        setTimeout(() => {
            form.reset();
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }, 2000);
    }

    if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }

    return false;
}

function validateFormData(data) {
    if (!data.name || !data.phone || !data.email || !data.projectType || !data.material || !data.floors || !data.weight || !data.location) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
        return false;
    }

    return true;
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    const alertClass = type === 'success' ? 'alert-success' : type === 'danger' ? 'alert-danger' : 'alert-info';

    formMessage.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (type === 'success') {
        setTimeout(() => {
            const alert = formMessage.querySelector('.alert');
            if (alert && window.bootstrap && window.bootstrap.Alert) {
                const bsAlert = new window.bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

function validateSingleField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}Error`);

    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        if (errorElement) errorElement.textContent = 'Este campo es obligatorio';
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Email invalido';
            return false;
        }
    }

    if (field.id === 'phone' && value) {
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Telefono invalido';
            return false;
        }
    }

    if (field.id === 'floors' && value) {
        const floorsNum = parseInt(value, 10);
        if (isNaN(floorsNum) || floorsNum < 1 || floorsNum > 45) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Debe ser entre 1 y 45';
            return false;
        }
    }

    if (field.id === 'weight' && value) {
        const weightNum = parseInt(value, 10);
        if (isNaN(weightNum) || weightNum < 1 || weightNum > 400) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Debe ser entre 1 y 400 kg';
            return false;
        }
    }

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (errorElement) errorElement.textContent = '';
    return true;
}

// Prueba rapida del endpoint de formulario
async function testConnection() {
    console.log('Testing form Apps Script connection...');

    try {
        const proxyUrl = 'https://corsproxy.io/?';
        const fullUrl = proxyUrl + encodeURIComponent(FORM_APPS_SCRIPT_URL);

        const response = await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors'
        });

        console.log('Form endpoint reachable:', FORM_APPS_SCRIPT_URL, response.status);
        return true;
    } catch (error) {
        console.error('Connection test error:', error);
        return false;
    }
}

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Google Sheets integration loaded');
    console.log('Form endpoint:', FORM_APPS_SCRIPT_URL);

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);

        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });
        });
    }
});

// Exponer para uso global
window.handleContactFormSubmit = handleContactFormSubmit;
window.submitToGoogleSheets = submitToGoogleSheets;
window.testConnection = testConnection;
window.FORM_APPS_SCRIPT_URL = FORM_APPS_SCRIPT_URL;

// Exportar para pruebas en entorno Node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitToGoogleSheets,
        handleContactFormSubmit,
        testConnection,
        FORM_APPS_SCRIPT_URL
    };
}
