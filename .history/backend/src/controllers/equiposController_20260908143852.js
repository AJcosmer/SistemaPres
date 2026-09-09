import * as equiposData from '../data/equiposData.js';

export async function listarEquipos(req, res) {
  try {
    const equipos = await equiposData.obtenerTodos();
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar los equipos' });
  }
}

export async function obtenerEquipo(req, res) {
  try {
    const equipo = await equiposData.obtenerPorId(req.params.id);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    res.status(200).json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el equipo' });
  }
}

export async function crearEquipo(req, res) {
  try {
    const { nombre, tipo, serial, estado, observacion } = req.body;
    
    if (!nombre || !tipo || !serial) {
      return res.status(400).json({ error: 'Campos obligatorios incompletos' });
    }

    const nuevoId = await equiposData.crear({ nombre, tipo, serial, estado, observacion });
    res.status(201).json({ mensaje: 'Equipo registrado exitosamente', id: nuevoId });
  } catch (error) {
    if (error.message.includes('ORA-00001')) {
      return res.status(400).json({ error: 'El serial ya existe en la base de datos' });
    }
    res.status(500).json({ error: 'Error al registrar el equipo' });
  }
}

export async function actualizarEquipo(req, res) {
  try {
    const { id } = req.params;
    const { nombre, tipo, serial, estado, observacion } = req.body;

    if (!nombre || !tipo || !serial || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const afectadas = await equiposData.actualizar(id, { nombre, tipo, serial, estado, observacion });
    if (afectadas === 0) return res.status(404).json({ error: 'Equipo no encontrado' });

    res.status(200).json({ mensaje: 'Equipo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el equipo' });
  }
}

export async function eliminarEquipo(req, res) {
  try {
    const { id } = req.params;
    const afectadas = await equiposData.eliminar(id);
    if (afectadas === 0) return res.status(404).json({ error: 'Equipo no encontrado' });

    res.status(200).json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (error) {
    if (error.message.includes('ORA-02292')) {
      return res.status(400).json({ error: 'No se puede eliminar un equipo con historial de préstamos' });
    }
    res.status(500).json({ error: 'Error al eliminar el equipo' });
  }
}