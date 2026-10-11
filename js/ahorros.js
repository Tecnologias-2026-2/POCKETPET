// js/ahorros.js

document.addEventListener('DOMContentLoaded', () => {
  const formAhorros = document.getElementById('ahorros-form');
  const totalAhorradoElement = document.querySelector('.card-total .card-amount');
  const barraProgreso = document.querySelector('.progress-bar-fill');
  const porcentajeTexto = document.querySelector('.progress-info .percent');

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

  // Función para actualizar la interfaz (Total y Tasa de ahorro)
  function actualizarInterfaz() {
    const ahorros = obtenerAhorros();
    
    // Calcular el total sumando todos los montos
    const totalAhorrado = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    
    // Mostrar el total en la tarjeta
    totalAhorradoElement.textContent = `$${totalAhorrado.toFixed(2)}`;

    // Simulación de Ingresos (Para calcular la tasa de ahorro)
    // Nota: En un flujo completo, esto vendría de localStorage.getItem('pocketpet_ingresos')
    const ingresosTotales = 5000; // Valor de ejemplo para poder ver la barra de progreso

    // Calcular porcentaje de ahorro
    let porcentaje = 0;
    if (ingresosTotales > 0) {
      porcentaje = (totalAhorrado / ingresosTotales) * 100;
    }

    // Actualizar barra de progreso y texto
    porcentajeTexto.textContent = `${Math.min(porcentaje, 100).toFixed(1)}%`;
    barraProgreso.style.width = `${Math.min(porcentaje, 100)}%`;
  }

  // Escuchar el evento de envío del formulario
  formAhorros.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Capturar los valores de los inputs
    const nombre = document.getElementById('nombre-ahorro').value;
    const monto = parseFloat(document.getElementById('monto-ahorro').value);
    const fecha = document.getElementById('fecha-ahorro').value;
    const notas = document.getElementById('notas-ahorro').value;

    // Crear el objeto del ahorro
    const nuevoAhorro = {
      id: Date.now(), // ID único basado en la fecha exacta
      nombre,
      monto,
      fecha,
      notas
    };

    // Guardar y actualizar UI
    guardarAhorro(nuevoAhorro);
    actualizarInterfaz();

    // Limpiar el formulario y dar feedback
    formAhorros.reset();
    alert('¡Ahorro registrado con éxito en tu PocketPet!');
  });

  // Inicializar la interfaz al cargar la página
  actualizarInterfaz();
});