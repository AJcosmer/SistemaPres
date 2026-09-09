import { getConnection } from '../config/db.js';
import oracledb from 'oracledb';

export async function obtenerTodos() {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT id, nombre, tipo, serial, estado, observacion FROM EQUIPOS ORDER BY id DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
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
      `SELECT id, nombre, tipo, serial, estado, observacion FROM EQUIPOS WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0] || null;
  } finally {
    if (conn) await conn.close();
  }
}

export async function crear(equipo) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO EQUIPOS (nombre, tipo, serial, estado, observacion) 
       VALUES (:nombre, :tipo, :serial, :estado, :observacion)
       RETURNING id INTO :id`,
      {
        nombre: equipo.nombre,
        tipo: equipo.tipo,
        serial: equipo.serial,
        estado: equipo.estado || 'DISPONIBLE',
        observacion: equipo.observacion || '',
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    return result.outBinds.id[0];
  } finally {
    if (conn) await conn.close();
  }
}

export async function actualizar(id, equipo) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `UPDATE EQUIPOS 
       SET nombre = :nombre, tipo = :tipo, serial = :serial, estado = :estado, observacion = :observacion 
       WHERE id = :id`,
      {
        id,
        nombre: equipo.nombre,
        tipo: equipo.tipo,
        serial: equipo.serial,
        estado: equipo.estado,
        observacion: equipo.observacion
      },
      { autoCommit: true }
    );
    return result.rowsAffected;
  } finally {
    if (conn) await conn.close();
  }
}

export async function cambiarEstado(id, nuevoEstado, connExistente = null) {
  const conn = connExistente || await getConnection();
  try {
    const result = await conn.execute(
      `UPDATE EQUIPOS SET estado = :estado WHERE id = :id`,
      { estado: nuevoEstado, id },
      { autoCommit: !connExistente }
    );
    return result.rowsAffected;
  } finally {
    if (!connExistente && conn) await conn.close();
  }
}

export async function eliminar(id) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `DELETE FROM EQUIPOS WHERE id = :id`,
      [id],
      { autoCommit: true }
    );
    return result.rowsAffected;
  } finally {
    if (conn) await conn.close();
  }
}