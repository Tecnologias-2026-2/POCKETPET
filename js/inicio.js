// js/inicio.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Capturar elementos principales
  const totalAhorrosElement = document.getElementById('inicio-total-ahorros');
  const totalIngresosElement = document.getElementById('inicio-total-ingresos');
  const totalGastosElement = document.getElementById('inicio-total-gastos');
  const balanceActualElement = document.getElementById('inicio-balance-actual');
  const totalMetasElement = document.getElementById('inicio-total-metas'); 

  // Utilidad para formatear en COP (Pesos Colombianos)
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  function actualizarPanelInicio() {
    // 2. Leer datos del localStorage
    const ahorros = JSON.parse(localStorage.getItem(claveUsuario('ahorros'))) || [];
    const ingresos = JSON.parse(localStorage.getItem(claveUsuario('ingresos'))) || [];
    const gastos = JSON.parse(localStorage.getItem(claveUsuario('gastos'))) || [];
    const metas = JSON.parse(localStorage.getItem(claveUsuario('metas'))) || [];

    // 3. Calcular totales
    const totalAhorrado = ahorros.reduce((total, a) => total + (a.monto || 0), 0);
    const totalIngresado = ingresos.reduce((total, i) => total + (i.monto || 0), 0);
    const totalGastado = gastos.reduce((total, g) => total + (g.monto || 0), 0);
    const balanceActual = totalIngresado - totalGastado;

    // 4. Actualizar tarjetas superiores
    if (totalAhorrosElement) totalAhorrosElement.textContent = formatCOP(totalAhorrado);
    if (totalIngresosElement) totalIngresosElement.textContent = formatCOP(totalIngresado);
    if (totalGastosElement) totalGastosElement.textContent = formatCOP(totalGastado);
    if (totalMetasElement) totalMetasElement.textContent = metas.length;
    
    if (balanceActualElement) {
      balanceActualElement.textContent = formatCOP(balanceActual);
      balanceActualElement.style.color = balanceActual < 0 ? '#dc2626' : '';
    }

    // 5. Actualizar paneles inferiores (Metas y Ahorros)
    const panelMetas = document.getElementById('panel-metas-body');
    const panelAhorros = document.getElementById('panel-ahorros-body');
    const contadorMetas = document.getElementById('inicio-contador-metas');
    const contadorAhorros = document.getElementById('inicio-contador-ahorros');

    // Actualizar los numeritos del título (ej. "Mis Metas 1")
    if(contadorMetas) contadorMetas.textContent = metas.length;
    if(contadorAhorros) contadorAhorros.textContent = ahorros.length;

    // Lógica para el panel de Metas
    if (metas.length > 0 && panelMetas) {
      panelMetas.classList.remove('empty');
      const ultimaMeta = metas[metas.length - 1]; // Tomar la última meta registrada
      let porcentaje = (ultimaMeta.ahorrado / ultimaMeta.objetivo) * 100;
      if (isNaN(porcentaje)) porcentaje = 0; // Evitar error si el objetivo es 0

      panelMetas.innerHTML = `
        <div style="width: 100%; text-align: left;">
          <h4 style="margin: 0 0 10px 0; color: #1e3a8a;">${ultimaMeta.nombre}</h4>
          <div style="width: 100%; background: #e5e7eb; border-radius: 99px; height: 10px; margin-bottom: 5px;">
             <div style="width: ${Math.min(porcentaje, 100)}%; background: #3b82f6; height: 100%; border-radius: 99px;"></div>
          </div>
          <small style="color: #6b7280;">Progreso: ${formatCOP(ultimaMeta.ahorrado)} / ${formatCOP(ultimaMeta.objetivo)}</small>
        </div>
      `;
    }

    // Lógica para el panel de Ahorros
    if (ahorros.length > 0 && panelAhorros) {
      panelAhorros.classList.remove('empty');
      const ultimoAhorro = ahorros[ahorros.length - 1]; // Tomar el último ahorro registrado
      
      panelAhorros.innerHTML = `
        <div style="width: 100%; text-align: left;">
          <h4 style="margin: 0 0 5px 0; color: #4b5563;">${ultimoAhorro.nombre}</h4>
          <strong style="color: #8b5cf6; font-size: 1.2rem;">+ ${formatCOP(ultimoAhorro.monto)}</strong>
          <br><small style="color: #9ca3af;">${ultimoAhorro.fecha}</small>
        </div>
      `;
    }
  }

  // 6. Ejecutar función inicial
  actualizarPanelInicio();
});