// js/inicio.js

document.addEventListener('DOMContentLoaded', () => {
  // Capturamos los elementos donde se mostrarán los totales
  const totalAhorrosElement = document.getElementById('inicio-total-ahorros');
  const totalIngresosElement = document.getElementById('inicio-total-ingresos');
  const balanceActualElement = document.getElementById('inicio-balance-actual');

  // Utilidad para formatear en COP (Pesos Colombianos)
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  function actualizarPanelInicio() {
    // 1. Obtener los datos del localStorage
    const ahorrosGuardados = localStorage.getItem('pocketpet_ahorros');
    const ahorros = ahorrosGuardados ? JSON.parse(ahorrosGuardados) : [];

    const ingresosGuardados = localStorage.getItem('pocketpet_ingresos');
    const ingresos = ingresosGuardados ? JSON.parse(ingresosGuardados) : [];

    // 2. Sumar todos los montos
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    const totalIngresado = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);

    // 3. Mostrar los totales en las tarjetas correspondientes
    if (totalAhorrosElement) {
      totalAhorrosElement.textContent = formatCOP(totalAhorrado);
    }
    
    if (totalIngresosElement) {
      totalIngresosElement.textContent = formatCOP(totalIngresado);
    }

    // 4. Calcular y mostrar el Balance Actual 
    // (Por ahora es igual a los ingresos, en el próximo paso le restaremos los gastos)
    if (balanceActualElement) {
      balanceActualElement.textContent = formatCOP(totalIngresado);
    }
  }

  // Ejecutamos la función apenas cargue la página de inicio
  actualizarPanelInicio();
});