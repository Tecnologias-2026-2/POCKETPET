// js/inicio.js

document.addEventListener('DOMContentLoaded', () => {
  // Capturamos el elemento donde se mostrará el total de ahorros
  const totalAhorrosElement = document.getElementById('inicio-total-ahorros');

  // Utilidad para formatear en COP (Pesos Colombianos)
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 0 
    }).format(valor);
  };

  function actualizarPanelInicio() {
    // 1. Obtener los ahorros del localStorage
    const ahorrosGuardados = localStorage.getItem('pocketpet_ahorros');
    const ahorros = ahorrosGuardados ? JSON.parse(ahorrosGuardados) : [];

    // 2. Sumar todos los montos
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);

    // 3. Mostrar el total en la tarjeta
    if (totalAhorrosElement) {
      totalAhorrosElement.textContent = formatCOP(totalAhorrado);
    }
  }

  // Ejecutamos la función apenas cargue la página
  actualizarPanelInicio();
});