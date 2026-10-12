// js/ingresos.js

document.addEventListener('DOMContentLoaded', () => {
  const formIngresos = document.getElementById('ingreso-form');
  const totalIngresosElement = document.querySelector('.card-total-ingresos .card-amount');
  const listaHistorial = document.getElementById('lista-historial-ingresos');
  const btnReset = document.getElementById('btn-reset-ingresos');

  // Utilidad para formatear en COP
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  function obtenerIngresos() {
    const ingresos = localStorage.getItem(claveUsuario('ingresos'));
    return ingresos ? JSON.parse(ingresos) : [];
  }

  function guardarIngreso(nuevoIngreso) {
    const ingresos = obtenerIngresos();
    ingresos.push(nuevoIngreso);
    localStorage.setItem(claveUsuario('ingresos'), JSON.stringify(ingresos));
  }

  function renderizarHistorial(ingresos) {
    if(!listaHistorial) return;
    listaHistorial.innerHTML = ''; 
    
    if(ingresos.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem; text-align: center;">No hay ingresos registrados aún.</p>';
        return;
    }

    const ingresosInvertidos = [...ingresos].reverse();

    ingresosInvertidos.forEach(ingreso => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-item-info">
                <span class="history-item-name">${ingreso.tipo}</span>
                <span class="history-item-date">${ingreso.fecha}</span>
            </div>
            <span class="history-item-amount">+ ${formatCOP(ingreso.monto)}</span>
        `;
        listaHistorial.appendChild(item);
    });
  }

  function actualizarInterfaz() {
    const ingresos = obtenerIngresos();
    const totalIngresos = ingresos.reduce((total, ing) => total + ing.monto, 0);
    
    if (totalIngresosElement) {
      totalIngresosElement.textContent = formatCOP(totalIngresos);
    }
    renderizarHistorial(ingresos);
  }

  formIngresos.addEventListener('submit', (e) => {
    e.preventDefault();

    const tipo = document.getElementById('tipo-ingreso').value;
    const monto = parseFloat(document.getElementById('monto-ingreso').value);
    const fecha = document.getElementById('fecha-ingreso').value;
    const notas = document.getElementById('notas-ingreso').value;

    const nuevoIngreso = { id: Date.now(), tipo, monto, fecha, notas };

    guardarIngreso(nuevoIngreso);
    actualizarInterfaz();
    formIngresos.reset();
  });

  btnReset.addEventListener('click', () => {
    if(confirm('¿Estás seguro de que deseas borrar todo el historial de ingresos?')) {
      localStorage.removeItem(claveUsuario('ingresos'));
      actualizarInterfaz();
    }
  });

  actualizarInterfaz();
});