export function renderizarResumen(equipos) {
  document.getElementById('total-equipos').textContent = equipos.length;
  document.getElementById('equipos-disponibles').textContent = equipos.filter(e => e.ESTADO === 'DISPONIBLE').length;
  document.getElementById('equipos-prestados').textContent = equipos.filter(e => e.ESTADO === 'PRESTADO').length;
  document.getElementById('equipos-mantenimiento').textContent = equipos.filter(e => e.ESTADO === 'MANTENIMIENTO').length;
}

export function renderizarTablaEquipos(equipos, onEditar, onEliminar) {
  const tbody = document.getElementById('tabla-equipos-body');
  tbody.innerHTML = '';

  equipos.forEach(eq => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${eq.ID}</td>
      <td>${eq.NOMBRE}</td>
      <td>${eq.TIPO}</td>
      <td>${eq.SERIAL}</td>
      <td><strong>${eq.ESTADO}</strong></td>
      <td>${eq.OBSERVACION || '-'}</td>
      <td>
        <button class="btn-warning btn-sm" data-id="${eq.ID}">Editar</button>
        <button class="btn-danger btn-sm" data-del="${eq.ID}">Eliminar</button>
      </td>
    `;

    tr.querySelector('[data-id]').addEventListener('click', () => onEditar(eq));
    tr.querySelector('[data-del]').addEventListener('click', () => onEliminar(eq.ID));

    tbody.appendChild(tr);
  });
}

export function cargarSelectDisponibles(equipos) {
  const select = document.getElementById('prestamo-equipo');
  select.innerHTML = '<option value="">-- Seleccione un equipo --</option>';

  const disponibles = equipos.filter(e => e.ESTADO === 'DISPONIBLE');
  disponibles.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.ID;
    opt.textContent = `${e.NOMBRE} (${e.SERIAL})`;
    select.appendChild(opt);
  });
}

export function renderizarTablaPrestamos(prestamos, onDevolver) {
  const tbody = document.getElementById('tabla-prestamos-body');
  tbody.innerHTML = '';

  prestamos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.ID}</td>
      <td>${p.EQUIPO}</td>
      <td>${p.RESPONSABLE}</td>
      <td>${p.IDENTIFICACION}</td>
      <td>${p.FECHA_PRESTAMO}</td>
      <td>${p.FECHA_DEVOLUCION_PREVISTA}</td>
      <td><strong>${p.ESTADO}</strong></td>
      <td>
        ${p.ESTADO === 'ACTIVO' 
          ? `<button class="btn-secundario" data-dev="${p.ID}">Registrar Devolución</button>` 
          : 'Devuelto'}
      </td>
    `;

    const btnDev = tr.querySelector('[data-dev]');
    if (btnDev) btnDev.addEventListener('click', () => onDevolver(p.ID));

    tbody.appendChild(tr);
  });
}

export function mostrarAlerta(mensaje, esError = false) {
  const alerta = document.getElementById('mensaje-alerta');
  alerta.textContent = mensaje;
  alerta.className = `alerta ${esError ? 'alerta-error' : 'alerta-exito'}`;
  setTimeout(() => alerta.className = 'alerta oculta', 4000);
}