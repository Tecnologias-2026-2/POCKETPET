// js/gastos.js

document.addEventListener('DOMContentLoaded', () => {
  const formGastos = document.getElementById('gastos-form');
  const ingresosTotalElement = document.getElementById('gasto-ingresos-total');
  const gastosTotalElement = document.getElementById('gasto-gastos-total');
  const saldoTotalElement = document.getElementById('gasto-saldo-total');
  const listaHistorial = document.getElementById('lista-historial-gastos');
  const btnReset = document.getElementById('btn-reset-gastos');

  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  function obtenerDatos(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
  }

  function guardarGasto(nuevoGasto) {
    const gastos = obtenerDatos('pocketpet_gastos');
    gastos.push(nuevoGasto);
    localStorage.setItem('pocketpet_gastos', JSON.stringify(gastos));
  }

  function renderizarHistorial(gastos) {
    if(!listaHistorial) return;
    listaHistorial.innerHTML = ''; 
    
    if(gastos.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem; text-align: center;">No hay gastos registrados aún.</p>';
        return;
    }

    const gastosInvertidos = [...gastos].reverse();

    gastosInvertidos.forEach(gasto => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-item-info">
                <span class="history-item-name">${gasto.descripcion} (${gasto.categoria})</span>
                <span class="history-item-date">${gasto.fecha}</span>
            </div>
            <span class="history-item-amount">- ${formatCOP(gasto.monto)}</span>
        `;
        listaHistorial.appendChild(item);
    });
  }

  function actualizarInterfaz() {
    const gastos = obtenerDatos('pocketpet_gastos');
    const ingresos = obtenerDatos('pocketpet_ingresos');

    const totalGastos = gastos.reduce((total, g) => total + g.monto, 0);
    const totalIngresos = ingresos.reduce((total, ing) => total + ing.monto, 0);
    const saldoDisponible = totalIngresos - totalGastos;
    
    if (ingresosTotalElement) ingresosTotalElement.textContent = formatCOP(totalIngresos);
    if (gastosTotalElement) gastosTotalElement.textContent = formatCOP(totalGastos);
    
    if (saldoTotalElement) {
      saldoTotalElement.textContent = formatCOP(saldoDisponible);
      // Cambiar color a rojo si el saldo es negativo
      saldoTotalElement.style.color = saldoDisponible < 0 ? '#dc2626' : '';
    }

    renderizarHistorial(gastos);
  }

  formGastos.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = document.getElementById('descripcion-gasto').value;
    const monto = parseFloat(document.getElementById('monto-gasto').value);
    const categoria = document.getElementById('categoria-gasto').value;
    const fecha = document.getElementById('fecha-gasto').value;
    const notas = document.getElementById('notas-gasto').value;

    const ingresosActuales = obtenerDatos('pocketpet_ingresos').reduce((acc, curr) => acc + curr.monto, 0);
    const gastosActuales = obtenerDatos('pocketpet_gastos').reduce((acc, curr) => acc + curr.monto, 0);
    
    // Alerta opcional si se excede el presupuesto
    if ((gastosActuales + monto) > ingresosActuales) {
        alert('⚠️ Advertencia: Este gasto superará tus ingresos registrados.');
    }

    const nuevoGasto = { id: Date.now(), descripcion, monto, categoria, fecha, notas };

    guardarGasto(nuevoGasto);
    actualizarInterfaz();
    formGastos.reset();
  });

  btnReset.addEventListener('click', () => {
    if(confirm('¿Estás seguro de que deseas borrar todo el historial de gastos?')) {
      localStorage.removeItem('pocketpet_gastos');
      actualizarInterfaz();
    }
  });

  actualizarInterfaz();
});