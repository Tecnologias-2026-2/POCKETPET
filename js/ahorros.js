// js/ahorros.js

document.addEventListener('DOMContentLoaded', () => {
  const formAhorros = document.getElementById('ahorros-form');
  const totalAhorradoElement = document.querySelector('.card-total .card-amount');
  const barraProgreso = document.querySelector('.progress-bar-fill');
  const porcentajeTexto = document.querySelector('.progress-info .percent');
  
  // Nuevos elementos seleccionados
  const listaHistorial = document.getElementById('lista-historial-ahorros');
  const btnReset = document.getElementById('btn-reset-ahorros');

  // Utilidad para formatear en COP (Pesos Colombianos)
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  // Función para cargar los ahorros desde localStorage
  function obtenerAhorros() {
    const ahorros = localStorage.getItem('pocketpet_ahorros');
    return ahorros ? JSON.parse(ahorros) : [];
  }

  // Función para guardar un nuevo ahorro
  function guardarAhorro(nuevoAhorro) {
    const ahorros = obtenerAhorros();
    ahorros.push(nuevoAhorro);
    localStorage.setItem('pocketpet_ahorros', JSON.stringify(ahorros));
  }

  // Renderizar la lista del historial
  function renderizarHistorial(ahorros) {
    listaHistorial.innerHTML = ''; // Limpiar lista
    
    if(ahorros.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem; text-align: center;">No hay ahorros registrados aún.</p>';
        return;
    }

    // Invertir el array para mostrar el más reciente arriba
    const ahorrosInvertidos = [...ahorros].reverse();

    ahorrosInvertidos.forEach(ahorro => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-item-info">
                <span class="history-item-name">${ahorro.nombre}</span>
                <span class="history-item-date">${ahorro.fecha}</span>
            </div>
            <span class="history-item-amount">${formatCOP(ahorro.monto)}</span>
        `;
        listaHistorial.appendChild(item);
    });
  }

  // Función para actualizar toda la interfaz
  function actualizarInterfaz() {
    const ahorros = obtenerAhorros();
    
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    totalAhorradoElement.textContent = formatCOP(totalAhorrado);

    const ingresosTotales = 5000000; // 5 millones de COP de ejemplo
    let porcentaje = 0;
    if (ingresosTotales > 0) {
      porcentaje = (totalAhorrado / ingresosTotales) * 100;
    }

    porcentajeTexto.textContent = `${Math.min(porcentaje, 100).toFixed(1)}%`;
    barraProgreso.style.width = `${Math.min(porcentaje, 100)}%`;

    // Actualizamos también el historial
    renderizarHistorial(ahorros);
  }

  // Escuchar el evento de envío del formulario
  formAhorros.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre-ahorro').value;
    const monto = parseFloat(document.getElementById('monto-ahorro').value);
    const fecha = document.getElementById('fecha-ahorro').value;
    const notas = document.getElementById('notas-ahorro').value;

    const nuevoAhorro = {
      id: Date.now(),
      nombre,
      monto,
      fecha,
      notas
    };

    guardarAhorro(nuevoAhorro);
    actualizarInterfaz();
    formAhorros.reset();
  });

  // Escuchar el botón de reiniciar datos
  btnReset.addEventListener('click', () => {
    // Pedir confirmación al usuario
    if(confirm('¿Estás seguro de que deseas borrar todo el historial de ahorros? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('pocketpet_ahorros'); // Esto borra los datos guardados
      actualizarInterfaz(); // Esto devuelve todo a 0
    }
  });

  // Inicializar al cargar
  actualizarInterfaz();
});