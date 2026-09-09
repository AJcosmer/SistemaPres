# Sistema de Préstamo de Equipos Tecnológicos

Sistema web SPA (*Single Page Application*) para la gestión y control de préstamos de equipos tecnológicos dentro de un entorno académico.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Vanilla JavaScript (ES6+ modular), HTML5, CSS3.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** Oracle Database 21c XE (utilizando el driver `oracledb`).
* **Arquitectura:** Desacoplada (API REST / Frontend SPA) estructurada en capas (`controllers`, `routes`, `services`).

---

## 🗄️ Modelo de Base de Datos

El sistema maneja dos entidades principales conectadas mediante restricciones de integridad:

1. `EQUIPOS`: Almacena información de los dispositivos (id, nombre, tipo, serial, estado, observación).
2. `PRESTAMOS`: Registra las transacciones asociadas a los equipos (equipo_id, responsable, identificación, fechas y estado).

> **Nota:** El script de creación de tablas y datos de prueba se encuentra en `database/script.sql`.

---

## 🚀 Instalación y Configuración

### 1. Base de Datos

1. Abre tu gestor de Oracle (SQL*Plus, SQL Developer o APEX).
2. Ejecuta el script ubicado en `database/script.sql` para crear las tablas, restricciones (`CHECK`, `FOREIGN KEY`) e inserciones iniciales.

### 2. Backend

1. Navega a la carpeta del servidor:
```bash
cd backend

```


2. Instala las dependencias necesarias:
```bash
npm install

```


3. Configura las variables de entorno en el archivo `.env`:
```env
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_CONNECT_STRING=localhost:1521/XEPDB1

```


4. Inicia el servidor:
```bash
npm start

```
         


### 3. Frontend

Abre el archivo `frontend/index.html` en tu navegador o despliégalo mediante un servidor local (como *Live Server* en VS Code).

