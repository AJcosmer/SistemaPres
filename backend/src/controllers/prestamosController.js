import * as prestamosData from '../data/prestamosData.js';
import * as equiposData from '../data/equiposData.js';

export async function listarPrestamos(req, res) {
  try {
    const prestamos = await prestamosData.obtenerTodos();
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar préstamos' });
  }
}

export async function crearPrestamo(req, res) {
  try {
    const { equipo_id, responsable, identificacion, fecha_prestamo, fecha_devolucion_prevista } = req.body;

    // Validaciones obligatorias y de reglas de negocio
    if (!equipo_id || !responsable || !identificacion || !fecha_prestamo || !fecha_devolucion_prevista) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (new Date(fecha_devolucion_prevista) < new Date(fecha_prestamo)) {
      return res.status(400).json({ error: 'La fecha prevista de devolución no puede ser anterior a la fecha de préstamo' });
    }

    const equipo = await equiposData.obtenerPorId(equipo_id);
    if (!equipo) {
      return res.status(404).json({ error: 'El equipo seleccionado no existe' });
    }

    if (equipo.ESTADO !== 'DISPONIBLE') {
      return res.status(400).json({ error: `El equipo no se puede prestar porque su estado es ${equipo.ESTADO}` });
    }

    await prestamosData.registrarPrestamo({ equipo_id, responsable, identificacion, fecha_prestamo, fecha_devolucion_prevista });
    res.status(201).json({ mensaje: 'Préstamo registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al registrar el préstamo' });
  }
}

export async function devolverPrestamo(req, res) {
  try {
    const { id } = req.params;
    const prestamo = await prestamosData.obtenerPorId(id);

    if (!prestamo) {
      return res.status(404).json({ error: 'El préstamo solicitado no existe' });
    }

    if (prestamo.ESTADO === 'DEVUELTO') {
      return res.status(400).json({ error: 'Este préstamo ya fue devuelto anteriormente' });
    }

    await prestamosData.registrarDevolucion(id, prestamo.EQUIPO_ID);
    res.status(200).json({ mensaje: 'Devolución registrada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la devolución' });
  }
}