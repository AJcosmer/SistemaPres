import { getConnection } from '../config/db.js';
import oracledb from 'oracledb';

export async function obtenerTodos() {
  let conn;
  try {
    conn = await getConnection();
    const sql = `
      SELECT p.id, p.equipo_id, e.nombre AS equipo, p.responsable, p.identificacion,
             TO_CHAR(p.fecha_prestamo, 'YYYY-MM-DD') AS fecha_prestamo,
             TO_CHAR(p.fecha_devolucion_prevista, 'YYYY-MM-DD') AS fecha_devolucion_prevista,
             p.estado
      FROM PRESTAMOS p
      JOIN EQUIPOS e ON p.equipo_id = e.id
      ORDER BY p.id DESC
    `;
    const result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } finally {
    if (conn) await conn.close();
  }
}

export async function obtenerPorId(id) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT id, equipo_id, responsable, identificacion, estado FROM PRESTAMOS WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0] || null;
  } finally {
    if (conn) await conn.close();
  }
}

export async function registrarPrestamo(prestamo) {
  let conn;
  try {
    conn = await getConnection();
    
    // Transacción atómica: Crear préstamo + cambiar estado del equipo a PRESTADO
    await conn.execute(
      `INSERT INTO PRESTAMOS (equipo_id, responsable, identificacion, fecha_prestamo, fecha_devolucion_prevista, estado)
       VALUES (:equipo_id, :responsable, :identificacion, TO_DATE(:fecha_prestamo, 'YYYY-MM-DD'), TO_DATE(:fecha_devolucion_prevista, 'YYYY-MM-DD'), 'ACTIVO')`,
      {
        equipo_id: prestamo.equipo_id,
        responsable: prestamo.responsable,
        identificacion: prestamo.identificacion,
        fecha_prestamo: prestamo.fecha_prestamo,
        fecha_devolucion_prevista: prestamo.fecha_devolucion_prevista
      }
    );

    await conn.execute(
      `UPDATE EQUIPOS SET estado = 'PRESTADO' WHERE id = :id`,
      [prestamo.equipo_id]
    );

    await conn.commit();
    return true;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}

export async function registrarDevolucion(prestamoId, equipoId) {
  let conn;
  try {
    conn = await getConnection();

    // Transacción atómica: Marcar préstamo DEVUELTO + cambiar estado del equipo a DISPONIBLE
    await conn.execute(
      `UPDATE PRESTAMOS SET estado = 'DEVUELTO' WHERE id = :id`,
      [prestamoId]
    );

    await conn.execute(
      `UPDATE EQUIPOS SET estado = 'DISPONIBLE' WHERE id = :id`,
      [equipoId]
    );

    await conn.commit();
    return true;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}