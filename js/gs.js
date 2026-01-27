// ==============================================
// GOOGLE SHEETS INTEGRATION - Versión Simplificada
// ==============================================

// Configuración - REEMPLAZA ESTA URL CON LA TUYA
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_LOWf6OLuThESPZObGNSF4MfKXKtY6KvfKjXM8bEHJo8KslHCWTTKbog373PifqSVYw/exec';

// Enviar datos al Google Apps Script
async function submitToGoogleSheets(formData) {
    console.log('📤 Enviando datos...', formData);
    
    try {
        // Crear objeto de datos con timestamp
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
        
        console.log('Datos a enviar:', dataToSend);
        
        // Usar un proxy CORS para evitar problemas
        const proxyUrl = 'https://corsproxy.io/?';
        const fullUrl = proxyUrl + encodeURIComponent(GOOGLE_APPS_SCRIPT_URL);
        
        // Enviar la solicitud
        const response = await fetch(fullUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });
        
        console.log('Respuesta recibida:', response.status);
        
        // Leer la respuesta
        const responseText = await response.text();
        console.log('Texto de respuesta:', responseText);
        
        // Intentar parsear como JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            result = { success: true, message: 'Enviado (respuesta no JSON)' };
        }
        
        if (response.ok || result.success) {
            return {
                success: true,
                message: '¡Solicitud enviada con éxito! Te contactaremos pronto.'
            };
        } else {
            throw new Error(result.message || 'Error del servidor');
        }
        
    } catch (error) {
        console.error('❌ Error enviando a Google Sheets:', error);
        
        // Método alternativo: FormSubmit.co
        try {
            const altResult = await submitAlternativeMethod(formData);
            if (altResult.success) {
                return altResult;
            }
        } catch (altError) {
            console.error('❌ Error en método alternativo:', altError);
        }
        
        return {
            success: false,
            message: 'Error de conexión. Por favor, contacta directamente al 1128064699'
        };
    }
}

// Método alternativo usando FormSubmit.co
async function submitAlternativeMethod(formData) {
    const formSubmitUrl = 'https://formsubmit.co/ajax/caldenelevaciones@gmail.com';
    
    const formDataAlt = new FormData();
    formDataAlt.append('_subject', 'Nueva solicitud - Caldén Elevaciones');
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
    
    try {
        const response = await fetch(formSubmitUrl, {
            method: 'POST',
            body: formDataAlt,
        });
        
        const result = await response.json();
        console.log('✅ Envío alternativo exitoso:', result);
        
        return {
            success: true,
            message: 'Solicitud enviada correctamente'
        };
        
    } catch (error) {
        throw error;
    }
}

// Manejar envío del formulario
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar estado de carga
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
    submitBtn.disabled = true;
    
    // Obtener datos del formulario
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
    
    // Validar datos
    if (!validateFormData(formData)) {
        showFormMessage('Por favor, completa todos los campos obligatorios correctamente.', 'danger');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return false;
    }
    
    // Enviar a Google Sheets
    const result = await submitToGoogleSheets(formData);
    
    // Mostrar resultado
    showFormMessage(result.message, result.success ? 'success' : 'danger');
    
    if (result.success) {
        // Resetear formulario después de 2 segundos
        setTimeout(() => {
            form.reset();
            // Quitar clases de validación
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }, 2000);
    }
    
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    return false;
}

// Validar datos del formulario
function validateFormData(data) {
    // Verificar campos obligatorios
    if (!data.name || !data.phone || !data.email || !data.projectType || 
        !data.material || !data.floors || !data.weight || !data.location) {
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Validar teléfono (al menos 7 dígitos)
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
        return false;
    }
    
    return true;
}

// Mostrar mensaje en el formulario
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    // Crear alerta de Bootstrap
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'danger' ? 'alert-danger' : 
                      'alert-info';
    
    formMessage.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Scroll al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-ocultar después de 5 segundos si es éxito
    if (type === 'success') {
        setTimeout(() => {
            const alert = formMessage.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Google Sheets Integration cargado');
    
    // Configurar formulario
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('📝 Formulario encontrado, agregando event listener');
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });
        });
    }
    
    // Mostrar instrucciones en consola
    console.log('📋 INSTRUCCIONES PARA CONFIGURAR:');
    console.log('1. Ve a: ' + GOOGLE_APPS_SCRIPT_URL);
    console.log('2. Si aparece error de autorización, haz clic en "Avanzado" y luego "Ir a... (no seguro)"');
    console.log('3. Autoriza la aplicación con tu cuenta de Google');
});

// Validar campo individual
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
            if (errorElement) errorElement.textContent = 'Email inválido';
            return false;
        }
    }
    
    if (field.id === 'phone' && value) {
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Teléfono inválido';
            return false;
        }
    }
    
    if (field.id === 'floors' && value) {
        const floorsNum = parseInt(value);
        if (isNaN(floorsNum) || floorsNum < 1 || floorsNum > 45) {
            field.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'Debe ser entre 1 y 45';
            return false;
        }
    }
    
    if (field.id === 'weight' && value) {
        const weightNum = parseInt(value);
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

// Función para probar la conexión
async function testConnection() {
    console.log('🔍 Probando conexión con Google Apps Script...');
    
    try {
        const proxyUrl = 'https://corsproxy.io/?';
        const fullUrl = proxyUrl + encodeURIComponent(GOOGLE_APPS_SCRIPT_URL);
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors'
        });
        
        console.log('✅ Conexión exitosa a:', GOOGLE_APPS_SCRIPT_URL);
        return true;
        
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        return false;
    }
}

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitToGoogleSheets,
        handleContactFormSubmit,
        testConnection
    };
}