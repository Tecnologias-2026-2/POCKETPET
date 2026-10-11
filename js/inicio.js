// js/inicio.js

document.addEventListener('DOMContentLoaded', () => {
  // Capturamos los elementos donde se mostrarán los totales
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
    // 1. Obtener todos los datos del localStorage
    const ahorrosGuardados = localStorage.getItem('pocketpet_ahorros');
    const ahorros = ahorrosGuardados ? JSON.parse(ahorrosGuardados) : [];

    const ingresosGuardados = localStorage.getItem('pocketpet_ingresos');
    const ingresos = ingresosGuardados ? JSON.parse(ingresosGuardados) : [];

    const gastosGuardados = localStorage.getItem('pocketpet_gastos');
    const gastos = gastosGuardados ? JSON.parse(gastosGuardados) : [];

    const metasGuardadas = localStorage.getItem('pocketpet_metas');
    const metas = metasGuardadas ? JSON.parse(metasGuardadas) : [];

    // 2. Sumar todos los montos (y contar las metas activas)
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    const totalIngresado = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
    const totalGastado = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    const totalMetasActivas = metas.length;
    
    // 3. Calcular Balance Actual (Ingresos totales - Gastos totales)
    const balanceActual = totalIngresado - totalGastado;

    // 4. Mostrar los totales en las tarjetas de la pantalla de inicio
    if (totalAhorrosElement) totalAhorrosElement.textContent = formatCOP(totalAhorrado);
    if (totalIngresosElement) totalIngresosElement.textContent = formatCOP(totalIngresado);
    if (totalGastosElement) totalGastosElement.textContent = formatCOP(totalGastado);
    if (totalMetasElement) totalMetasElement.textContent = totalMetasActivas;
    
    if (balanceActualElement) {
      balanceActualElement.textContent = formatCOP(balanceActual);
      // Cambiamos el color a rojo si el usuario gasta más de lo que ingresa
      balanceActualElement.style.color = balanceActual < 0 ? '#dc2626' : '';
    }
  }

  // Ejecutamos la función apenas cargue la página
  actualizarPanelInicio();
});