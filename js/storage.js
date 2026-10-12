// js/storage.js

function claveUsuario(nombre) {
  const usuario = localStorage.getItem('usuarioActual') || 'anonimo';
  return `pocketpet_${nombre}_${usuario}`;
}

// Al hacer clic en "Cerrar sesión", se borra el usuario actual
document.addEventListener('click', (e) => {
  const logout = e.target.closest('.logout');
  if (logout) {
    localStorage.removeItem('usuarioActual');
    // el enlace sigue su camino normal hacia index.html
  }
});

// Muestra el usuario real en la barra de navegación (en vez de "Usuario" y "U")
document.addEventListener('DOMContentLoaded', () => {
  const email = localStorage.getItem('usuarioActual');
  if (!email) return;

  const nombre = localStorage.getItem('nombre_' + email) || email.split('@')[0];
  const nombreEl = document.querySelector('.user-name');
  const avatarEl = document.querySelector('.user-avatar');

  if (nombreEl) nombreEl.textContent = nombre;
  if (avatarEl) avatarEl.textContent = nombre.charAt(0).toUpperCase();
});