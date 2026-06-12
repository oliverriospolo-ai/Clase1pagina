// Array para almacenar códigos generados
let codigosGenerados = [];

// Función para generar código de barras
function generarCodigoBarras(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!nombre || !codigo) {
        alert('Por favor completa nombre y código');
        return;
    }
    
    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultadoCodigoBarras');
    const nombreProducto = document.getElementById('nombreProducto');
    const codigoTexto = document.getElementById('codigoTexto');
    
    nombreProducto.textContent = nombre;
    codigoTexto.textContent = `Código: ${codigo}`;
    resultadoDiv.style.display = 'block';
    
    // Generar código de barras con JsBarcode
    try {
        JsBarcode("#barcode", codigo, {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: true
        });
    } catch (e) {
        alert('Error al generar código de barras');
        console.error(e);
    }
    
    // Scroll al resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

// Función para agregar a lista
function agregarALista() {
    const nombre = document.getElementById('nombre').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!nombre || !codigo) {
        alert('Por favor completa nombre y código');
        return;
    }
    
    // Agregar a array
    codigosGenerados.push({
        nombre: nombre,
        codigo: codigo,
        descripcion: descripcion,
        fecha: new Date().toLocaleDateString('es-PE')
    });
    
    // Actualizar tabla
    actualizarTabla();
    
    // Mostrar sección de lista
    document.getElementById('listaCodigosSection').style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('nombre').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('descripcion').value = '';
    
    alert('✓ Código agregado a la lista');
}

// Función para actualizar tabla
function actualizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';
    
    codigosGenerados.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.codigo}</td>
            <td>${item.descripcion}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDeLista(${index})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para eliminar de lista
function eliminarDeLista(index) {
    codigosGenerados.splice(index, 1);
    actualizarTabla();
    
    if (codigosGenerados.length === 0) {
        document.getElementById('listaCodigosSection').style.display = 'none';
    }
}

// Función para limpiar lista
function limpiarLista() {
    if (confirm('¿Deseas limpiar toda la lista?')) {
        codigosGenerados = [];
        document.getElementById('listaCodigosSection').style.display = 'none';
        alert('Lista limpiada');
    }
}

// Función para descargar código de barras como imagen
function descargarCodigoBarras() {
    const svg = document.getElementById('barcode');
    const codigo = document.getElementById('codigo').value;
    
    if (!svg.querySelector('svg')) {
        alert('Primero genera un código de barras');
        return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `codigo_barras_${codigo}.png`;
        link.click();
        alert('✓ Código de barras descargado');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
}

// Función para exportar a Excel
function exportarAExcel() {
    if (codigosGenerados.length === 0) {
        alert('No hay códigos para exportar');
        return;
    }
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Convertir datos a hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(codigosGenerados, {
        header: ['nombre', 'codigo', 'descripcion', 'fecha'],
        defval: ''
    });
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
        { wch: 30 },
        { wch: 20 },
        { wch: 40 },
        { wch: 15 }
    ];
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Códigos de Barras');
    
    // Descargar archivo
    XLSX.writeFile(wb, `SG_FOREVER_Codigos_${new Date().toLocaleDateString('es-PE')}.xlsx`);
    alert('✓ Archivo Excel descargado');
}

// Agregar funcionalidad al botón CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.getElementById('generador').scrollIntoView({ behavior: 'smooth' });
        });
    }
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

// Aplicar observer a elementos
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.servicio-card, .sucursal, .resultado-codigo');
    elements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
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

// Función para enviar mensaje de contacto
function enviarMensaje(event) {
    event.preventDefault();
    
    const form = event.target;
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const mensaje = form.querySelector('textarea').value;
    
    alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.\nNos pondremos en contacto a ${email} pronto.`);
    form.reset();
}

console.log('SG FOREVER - Generador de Códigos de Barras Cargado Exitosamente');
