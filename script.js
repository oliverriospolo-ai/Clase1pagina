// ==================================
// VARIABLES GLOBALES
// ==================================
let pedidosData = [];
let usuarioActual = null;
let rolActual = null;

// Datos de ejemplo iniciales
const datosEjemplo = [
    {
        id: 1,
        numeroGuia: 'SG-2024-00001',
        cliente: 'Juan Pérez',
        destino: 'Lima',
        peso: 2.5,
        estado: 'enviado',
        fecha: new Date().toISOString().split('T')[0]
    },
    {
        id: 2,
        numeroGuia: 'SG-2024-00002',
        cliente: 'María García',
        destino: 'Arequipa',
        peso: 1.0,
        estado: 'pendiente',
        fecha: new Date().toISOString().split('T')[0]
    },
    {
        id: 3,
        numeroGuia: 'SG-2024-00003',
        cliente: 'Carlos López',
        destino: 'Trujillo',
        peso: 3.5,
        estado: 'no_enviado',
        fecha: new Date().toISOString().split('T')[0]
    },
    {
        id: 4,
        numeroGuia: 'SG-2024-00004',
        cliente: 'Ana Martínez',
        destino: 'Piura',
        peso: 0.8,
        estado: 'devuelto',
        fecha: new Date().toISOString().split('T')[0]
    }
];

// Inicializar datos
pedidosData = JSON.parse(JSON.stringify(datosEjemplo));

// ==================================
// FUNCIONES DE AUTENTICACIÓN
// ==================================
function handleLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const rol = document.getElementById('rol').value;
    
    if (!usuario || !contrasena || !rol) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Autenticación simulada (aceptar cualquier usuario/contraseña)
    usuarioActual = usuario;
    rolActual = rol;
    
    mostrarPantalla(rol);
    document.getElementById('loginForm').reset();
}

function logout() {
    usuarioActual = null;
    rolActual = null;
    
    // Ocultar todos los dashboards
    document.getElementById('gerentePage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'none';
    
    // Mostrar login
    document.getElementById('loginPage').style.display = 'flex';
    
    // Limpiar formularios
    document.getElementById('loginForm').reset();
    document.getElementById('registroForm').reset();
}

function mostrarPantalla(rol) {
    // Ocultar login
    document.getElementById('loginPage').style.display = 'none';
    
    if (rol === 'gerente') {
        // Mostrar dashboard del gerente
        document.getElementById('gerentePage').style.display = 'flex';
        document.getElementById('adminPage').style.display = 'none';
        actualizarDashboardGerente();
    } else if (rol === 'admin') {
        // Mostrar panel del administrador
        document.getElementById('adminPage').style.display = 'flex';
        document.getElementById('gerentePage').style.display = 'none';
        actualizarTablaRegistros();
    }
}

// ==================================
// FUNCIONES DASHBOARD GERENTE
// ==================================
function actualizarDashboardGerente() {
    calcularMetricas();
    actualizarTablaPedidos();
}

function calcularMetricas() {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Contar por estado del día actual
    let enviados = 0;
    let pendientes = 0;
    let noEnviados = 0;
    let devueltos = 0;
    
    pedidosData.forEach(pedido => {
        if (pedido.fecha === hoy) {
            if (pedido.estado === 'enviado') {
                enviados++;
            } else if (pedido.estado === 'pendiente') {
                pendientes++;
            } else if (pedido.estado === 'no_enviado') {
                noEnviados++;
            } else if (pedido.estado === 'devuelto') {
                devueltos++;
            }
        }
    });
    
    // Actualizar en el DOM
    document.getElementById('metricaEnviados').textContent = enviados;
    document.getElementById('metricaPendientes').textContent = pendientes;
    document.getElementById('metricaNoEnviados').textContent = noEnviados;
    document.getElementById('metricaDevueltos').textContent = devueltos;
}

function actualizarTablaPedidos() {
    const tbody = document.getElementById('pedidosTableBody');
    tbody.innerHTML = '';
    
    // Mostrar solo pedidos de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const pedidosHoy = pedidosData.filter(p => p.fecha === hoy);
    
    if (pedidosHoy.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No hay pedidos registrados para hoy</td></tr>';
        return;
    }
    
    pedidosHoy.forEach(pedido => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${pedido.numeroGuia}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.destino}</td>
            <td>${pedido.peso} kg</td>
            <td>${obtenerEtiquetaEstado(pedido.estado)}</td>
            <td>${pedido.fecha}</td>
        `;
        tbody.appendChild(fila);
    });
}

// ==================================
// FUNCIONES PANEL ADMINISTRADOR
// ==================================
function agregarRegistro(event) {
    event.preventDefault();
    
    const numeroGuia = document.getElementById('numeroGuia').value;
    const cliente = document.getElementById('cliente').value;
    const destino = document.getElementById('destino').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const estado = document.getElementById('estado').value;
    const fecha = document.getElementById('fecha').value;
    
    // Validar que el número de guía no exista
    if (pedidosData.some(p => p.numeroGuia === numeroGuia)) {
        mostrarMensaje('Este número de guía ya existe', 'error');
        return;
    }
    
    // Crear nuevo registro
    const nuevoRegistro = {
        id: pedidosData.length + 1,
        numeroGuia,
        cliente,
        destino,
        peso,
        estado,
        fecha
    };
    
    // Agregar a los datos
    pedidosData.push(nuevoRegistro);
    
    // Mostrar mensaje de éxito
    mostrarMensaje('Registro guardado exitosamente', 'exito');
    
    // Limpiar formulario
    document.getElementById('registroForm').reset();
    
    // Establecer fecha actual por defecto
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Actualizar tabla de registros
    actualizarTablaRegistros();
    
    // Si el gerente está conectado, actualizar su dashboard
    if (rolActual === 'gerente') {
        actualizarDashboardGerente();
    }
}

function eliminarRegistro(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        pedidosData = pedidosData.filter(p => p.id !== id);
        actualizarTablaRegistros();
        mostrarMensaje('Registro eliminado exitosamente', 'exito');
        
        // Si el gerente está conectado, actualizar su dashboard
        if (rolActual === 'gerente') {
            actualizarDashboardGerente();
        }
    }
}

function actualizarTablaRegistros() {
    const tbody = document.getElementById('registrosTableBody');
    tbody.innerHTML = '';
    
    if (pedidosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay registros ingresados</td></tr>';
        return;
    }
    
    // Mostrar en orden inverso (más nuevos primero)
    [...pedidosData].reverse().forEach(registro => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${registro.numeroGuia}</td>
            <td>${registro.cliente}</td>
            <td>${registro.destino}</td>
            <td>${registro.peso} kg</td>
            <td>${obtenerEtiquetaEstado(registro.estado)}</td>
            <td>${registro.fecha}</td>
            <td>
                <button class="btn-delete" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// ==================================
// FUNCIONES AUXILIARES
// ==================================
function obtenerEtiquetaEstado(estado) {
    const estados = {
        'enviado': '📤 Enviado Hoy',
        'pendiente': '⏳ Pendiente',
        'no_enviado': '❌ No Enviado',
        'devuelto': '🔄 Devuelto'
    };
    return estados[estado] || estado;
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'mensaje ' + tipo;
    mensajeDiv.style.display = 'block';
    
    // Ocultar el mensaje después de 4 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 4000);
}

// ==================================
// INICIALIZACIÓN
// ==================================
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha actual por defecto en el input de fecha
    const inputFecha = document.getElementById('fecha');
    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.value = hoy;
    }
    
    console.log('SG FOREVER - Sistema de Gestión de Paquetería Cargado Exitosamente');
});
