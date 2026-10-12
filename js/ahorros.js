// js/ahorros.js

document.addEventListener('DOMContentLoaded', () => {
  const formAhorros = document.getElementById('ahorros-form');
  const totalAhorradoElement = document.querySelector('.card-total .card-amount');
  const barraProgreso = document.querySelector('.progress-bar-fill');
  const porcentajeTexto = document.querySelector('.progress-info .percent');
  const listaHistorial = document.getElementById('lista-historial-ahorros');
  const btnReset = document.getElementById('btn-reset-ahorros');

  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  function obtenerAhorros() {
    const ahorros = localStorage.getItem(claveUsuario('ahorros'));
    return ahorros ? JSON.parse(ahorros) : [];
  }

  function renderizarHistorial(ahorros) {
    if(!listaHistorial) return;
    listaHistorial.innerHTML = ''; 
    
    if(ahorros.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem; text-align: center;">No hay ahorros registrados aún.</p>';
        return;
    }

    const ahorrosInvertidos = [...ahorros].reverse();

    ahorrosInvertidos.forEach(ahorro => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-item-info">
                <span class="history-item-name">${ahorro.nombre}</span>
                <span class="history-item-date">${ahorro.fecha}</span>
            </div>
            <span class="history-item-amount">+ ${formatCOP(ahorro.monto)}</span>
        `;
        listaHistorial.appendChild(item);
    });
  }

  function actualizarInterfaz() {
    const ahorros = obtenerAhorros();
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    if(totalAhorradoElement) totalAhorradoElement.textContent = formatCOP(totalAhorrado);

    // Conectar la barra de progreso con los ingresos reales guardados
    const ingresosGuardados = localStorage.getItem(claveUsuario('ingresos'));
    const ingresos = ingresosGuardados ? JSON.parse(ingresosGuardados) : [];
    const ingresosTotales = ingresos.reduce((total, i) => total + i.monto, 0);

    let porcentaje = 0;
    if (ingresosTotales > 0) {
      porcentaje = (totalAhorrado / ingresosTotales) * 100;
    }

    if(porcentajeTexto) porcentajeTexto.textContent = `${Math.min(porcentaje, 100).toFixed(1)}%`;
    if(barraProgreso) barraProgreso.style.width = `${Math.min(porcentaje, 100)}%`;

    renderizarHistorial(ahorros);
  }

  if (formAhorros) {
    formAhorros.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre-ahorro').value;
      const monto = parseFloat(document.getElementById('monto-ahorro').value);
      const fecha = document.getElementById('fecha-ahorro').value;
      const notas = document.getElementById('notas-ahorro').value;

      const nuevoAhorro = { id: Date.now(), nombre, monto, fecha, notas };

      // 1. Guardar el ahorro en el historial general
      const ahorros = obtenerAhorros();
      ahorros.push(nuevoAhorro);
      localStorage.setItem(claveUsuario('ahorros'), JSON.stringify(ahorros));

      // 2. VINCULACIÓN CON METAS
      const metasGuardadas = localStorage.getItem(claveUsuario('metas'));
      if (metasGuardadas) {
        let metas = JSON.parse(metasGuardadas);
        let metaActualizada = false;

        metas = metas.map(meta => {
          // Compara los nombres eliminando espacios extra y forzando minúsculas
          if (meta.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()) {
            meta.ahorrado += monto; // Suma el dinero del ahorro al progreso de la meta
            metaActualizada = true;
          }
          return meta;
        });

        // Si encontró una meta igual, guarda la actualización
        if (metaActualizada) {
          localStorage.setItem(claveUsuario('metas'), JSON.stringify(metas));
        }
      }

      actualizarInterfaz();
      formAhorros.reset();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if(confirm('¿Estás seguro de que deseas borrar todo el historial de ahorros?')) {
        localStorage.removeItem(claveUsuario('ahorros'));
        actualizarInterfaz();
      }
    });
  }

  actualizarInterfaz();
});