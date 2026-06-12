// Función para rastrear paquete
function rastrearPaquete() {
    const numeroGuia = document.getElementById('numeroGuia').value.trim();
    
    if (!numeroGuia) {
        alert('Por favor ingresa un número de guía');
        return;
    }
    
    // Simular búsqueda (en una aplicación real, esto haría una petición al servidor)
    const resultadoDiv = document.getElementById('resultadoRastreo');
    const numeroMostrado = document.getElementById('numeroMostrado');
    
    numeroMostrado.textContent = `Guía: ${numeroGuia}`;
    resultadoDiv.style.display = 'block';
    
    // Scroll al resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

// Función para cotizar envío
function cotizar(event) {
    event.preventDefault();
    
    const origen = document.getElementById('origen').value;
    const destino = document.getElementById('destino').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const servicio = document.getElementById('servicio').value;
    
    // Cálculo de costo base por km (simulado)
    const costoBase = 50; // MXN base
    let multiplicador = 1;
    
    // Ajustar multiplicador según el servicio
    if (servicio === 'express') {
        multiplicador = 2;
    } else if (servicio === 'regular') {
        multiplicador = 1.2;
    } else if (servicio === 'economico') {
        multiplicador = 0.8;
    }
    
    // Costo según peso (0.50 MXN por kg)
    const costoPeso = peso * 50;
    
    // Costo total (aproximado)
    const costoFinal = Math.round((costoBase + costoPeso) * multiplicador);
    
    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultadoCotizacion');
    const costoFinalSpan = document.getElementById('costoFinal');
    
    costoFinalSpan.textContent = `$${costoFinal} MXN`;
    resultadoDiv.style.display = 'block';
    
    // Scroll al resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

// Función para enviar mensaje de contacto
function enviarMensaje(event) {
    event.preventDefault();
    
    const form = event.target;
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const mensaje = form.querySelector('textarea').value;
    
    // Simular envío (en una aplicación real, esto haría una petición al servidor)
    alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.\nNos pondremos en contacto a ${email} pronto.`);
    
    // Limpiar formulario
    form.reset();
}

// Agregar funcionalidad al botón CTA (Comienza Ahora)
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.getElementById('cotizar').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Permitir presionar Enter en el buscador de rastreo
    document.getElementById('numeroGuia').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            rastrearPaquete();
        }
    });
});

// Animación de entrada para elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar observer a tarjetas de servicios
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.servicio-card, .sucursal');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Agregar validación adicional al formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.querySelector('.contacto-form');
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(event) {
            const email = this.querySelector('input[type="email"]').value;
            
            if (!validarEmail(email)) {
                event.preventDefault();
                alert('Por favor ingresa un email válido');
            }
        });
    }
});

// Verificar que el número de guía solo contenga caracteres válidos
document.getElementById('numeroGuia').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
});

console.log('SG FOREVER - Sistema de Paquetería Cargado Exitosamente');
