const API_URL = 'http://localhost:3000/api';

export async function getEquipos() {
  const res = await fetch(`${API_URL}/equipos`);
  return await res.json();
}

export async function crearEquipo(datos) {
  const res = await fetch(`${API_URL}/equipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return { status: res.status, data: await res.json() };
}

export async function actualizarEquipo(id, datos) {
  const res = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return { status: res.status, data: await res.json() };
}

export async function eliminarEquipo(id) {
  const res = await fetch(`${API_URL}/equipos/${id}`, { method: 'DELETE' });
  return { status: res.status, data: await res.json() };
}

export async function getPrestamos() {
  const res = await fetch(`${API_URL}/prestamos`);
  return await res.json();
}

export async function crearPrestamo(datos) {
  const res = await fetch(`${API_URL}/prestamos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return { status: res.status, data: await res.json() };
}

export async function devolverPrestamo(id) {
  const res = await fetch(`${API_URL}/prestamos/${id}/devolver`, { method: 'PUT' });
  return { status: res.status, data: await res.json() };
}