// js/metas.js

document.addEventListener('DOMContentLoaded', () => {
  const formMetas = document.getElementById('metas-form');
  const metasActivasElement = document.getElementById('metas-activas-total');
  const listaHistorial = document.getElementById('lista-historial-metas');
  const btnReset = document.getElementById('btn-reset-metas');

  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  function obtenerMetas() {
    const metas = localStorage.getItem('pocketpet_metas');
    return metas ? JSON.parse(metas) : [];
  }

  function renderizarHistorial(metas) {
    if(!listaHistorial) return;
    listaHistorial.innerHTML = ''; 
    
    if(metas.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem; text-align: center;">No tienes metas registradas aún.</p>';
        return;
    }

    const metasInvertidas = [...metas].reverse();

    metasInvertidas.forEach(meta => {
        let porcentaje = (meta.ahorrado / meta.objetivo) * 100;
        if(porcentaje > 100) porcentaje = 100;
        if(isNaN(porcentaje)) porcentaje = 0;

        const item = document.createElement('div');
        item.className = 'history-item';
        
        item.innerHTML = `
            <div class="history-item-info">
                <div class="history-item-top">
                    <span class="history-item-name">🎯 ${meta.nombre}</span>
                    <span class="history-item-date">Límite: ${meta.fecha}</span>
                </div>
                <div class="meta-progress-bar">
                    <div class="meta-progress-fill" style="width: ${porcentaje}%;"></div>
                </div>
                <div class="meta-amounts">
                    <span>Ahorrado: ${formatCOP(meta.ahorrado)}</span>
                    <span>Objetivo: ${formatCOP(meta.objetivo)}</span>
                </div>
            </div>
        `;
        listaHistorial.appendChild(item);
    });
  }

  function actualizarInterfaz() {
    const metas = obtenerMetas();
    if (metasActivasElement) metasActivasElement.textContent = metas.length;
    renderizarHistorial(metas);
  }

  if (formMetas) {
    formMetas.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre-meta').value;
      const categoria = document.getElementById('categoria-meta').value;
      const fecha = document.getElementById('fecha-limite').value;
      const objetivo = parseFloat(document.getElementById('monto-objetivo').value);
      const ahorrado = parseFloat(document.getElementById('monto-ahorrado').value) || 0;

      const nuevaMeta = { id: Date.now(), nombre, categoria, fecha, objetivo, ahorrado };

      const metas = obtenerMetas();
      metas.push(nuevaMeta);
      localStorage.setItem('pocketpet_metas', JSON.stringify(metas));

      actualizarInterfaz();
      formMetas.reset();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if(confirm('¿Borrar todas las metas?')) {
        localStorage.removeItem('pocketpet_metas');
        actualizarInterfaz();
      }
    });
  }

  // Inicializar al cargar la página
  actualizarInterfaz();
});
