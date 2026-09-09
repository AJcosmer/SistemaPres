import * as api from './api.js';
import * as ui from './interfaz.js';

let listaEquiposGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarTodo();
  establecerFechasPredeterminadas();

  document.getElementById('form-equipo').addEventListener('submit', guardarEquipo);
  document.getElementById('form-prestamo').addEventListener('submit', guardarPrestamo);
  document.getElementById('btn-cancelar-equipo').addEventListener('click', limpiarFormEquipo);
  
  // Funcionalidad Adicional: Búsqueda dinámica segura
  document.getElementById('input-buscar').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const filtrados = listaEquiposGlobal.filter(eq => 
      (eq.NOMBRE || '').toLowerCase().includes(busqueda) || 
      (eq.SERIAL || '').toLowerCase().includes(busqueda)
    );
    ui.renderizarTablaEquipos(filtrados, prepararEdicion, confirmarEliminacion);
  });
});

async function cargarTodo() {
  listaEquiposGlobal = await api.getEquipos();
  const prestamos = await api.getPrestamos();

  ui.renderizarResumen(listaEquiposGlobal);
  ui.renderizarTablaEquipos(listaEquiposGlobal, prepararEdicion, confirmarEliminacion);
  ui.cargarSelectDisponibles(listaEquiposGlobal);
  ui.renderizarTablaPrestamos(prestamos, ejecutarDevolucion);
}

function establecerFechasPredeterminadas() {
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('prestamo-fecha').value = hoy;
  document.getElementById('prestamo-devolucion').value = hoy;
}

async function guardarEquipo(e) {
  e.preventDefault();
  const id = document.getElementById('equipo-id').value;
  const payload = {
    nombre: document.getElementById('equipo-nombre').value,
    tipo: document.getElementById('equipo-tipo').value,
    serial: document.getElementById('equipo-serial').value,
    estado: document.getElementById('equipo-estado').value,
    observacion: document.getElementById('equipo-observacion').value
  };

  let respuesta;
  if (id) {
    respuesta = await api.actualizarEquipo(id, payload);
  } else {
    respuesta = await api.crearEquipo(payload);
  }

  if (respuesta.status === 200 || respuesta.status === 201) {
    ui.mostrarAlerta(respuesta.data.mensaje);
    limpiarFormEquipo();
    cargarTodo();
  } else {
    ui.mostrarAlerta(respuesta.data.error || respuesta.data.mensaje, true);
  }
}

function prepararEdicion(equipo) {
  document.getElementById('equipo-id').value = equipo.ID;
  document.getElementById('equipo-nombre').value = equipo.NOMBRE;
  document.getElementById('equipo-tipo').value = equipo.TIPO;
  document.getElementById('equipo-serial').value = equipo.SERIAL || '';
  document.getElementById('equipo-estado').value = equipo.ESTADO;
  document.getElementById('equipo-observacion').value = equipo.OBSERVACION || '';

  document.getElementById('form-equipo-titulo').textContent = 'Editar Equipo';
  document.getElementById('btn-cancelar-equipo').classList.remove('oculta');
}

function limpiarFormEquipo() {
  document.getElementById('form-equipo').reset();
  document.getElementById('equipo-id').value = '';
  document.getElementById('form-equipo-titulo').textContent = 'Registrar Equipo';
  document.getElementById('btn-cancelar-equipo').classList.add('oculta');
}

async function confirmarEliminacion(id) {
  if (confirm('¿Está seguro de eliminar este equipo?')) {
    const res = await api.eliminarEquipo(id);
    if (res.status === 200) {
      ui.mostrarAlerta(res.data.mensaje);
      cargarTodo();
    } else {
      ui.mostrarAlerta(res.data.error || res.data.mensaje, true);
    }
  }
}

async function guardarPrestamo(e) {
  e.preventDefault();
  const payload = {
    equipo_id: document.getElementById('prestamo-equipo').value,
    responsable: document.getElementById('prestamo-responsable').value,
    identificacion: document.getElementById('prestamo-identificacion').value,
    fecha_prestamo: document.getElementById('prestamo-fecha').value,
    fecha_devolucion_prevista: document.getElementById('prestamo-devolucion').value
  };

  const res = await api.crearPrestamo(payload);
  if (res.status === 201) {
    ui.mostrarAlerta(res.data.mensaje);
    document.getElementById('form-prestamo').reset();
    establecerFechasPredeterminadas();
    cargarTodo();
  } else {
    ui.mostrarAlerta(res.data.error || res.data.mensaje, true);
  }
}

async function ejecutarDevolucion(id) {
  if (confirm('¿Confirmar devolución del equipo?')) {
    const res = await api.devolverPrestamo(id);
    if (res.status === 200) {
      ui.mostrarAlerta(res.data.mensaje);
      cargarTodo();
    } else {
      ui.mostrarAlerta(res.data.error || res.data.mensaje, true);
    }
  }
}