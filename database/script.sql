-- 1. Eliminar tablas previas si existen
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE PRESTAMOS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE EQUIPOS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

-- 2. Tabla EQUIPOS
CREATE TABLE EQUIPOS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    tipo VARCHAR2(50) NOT NULL,
    serial VARCHAR2(50) NOT NULL UNIQUE,
    estado VARCHAR2(20) DEFAULT 'DISPONIBLE' NOT NULL,
    observacion VARCHAR2(255),
    CONSTRAINT chk_equipo_estado CHECK (estado IN ('DISPONIBLE', 'PRESTADO', 'MANTENIMIENTO'))
);

-- 3. Tabla PRESTAMOS
CREATE TABLE PRESTAMOS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipo_id NUMBER NOT NULL,
    responsable VARCHAR2(100) NOT NULL,
    identificacion VARCHAR2(20) NOT NULL,
    fecha_prestamo DATE DEFAULT SYSDATE NOT NULL,
    fecha_devolucion_prevista DATE NOT NULL,
    estado VARCHAR2(20) DEFAULT 'ACTIVO' NOT NULL,
    CONSTRAINT fk_prestamo_equipo FOREIGN KEY (equipo_id) REFERENCES EQUIPOS(id),
    CONSTRAINT chk_prestamo_estado CHECK (estado IN ('ACTIVO', 'DEVUELTO')),
    CONSTRAINT chk_fechas CHECK (fecha_devolucion_prevista >= fecha_prestamo)
);

-- 4. Datos iniciales
INSERT INTO EQUIPOS (nombre, tipo, serial, estado, observacion) 
VALUES ('Portatil Lenovo ThinkPad', 'Portatil', 'LEN-2026-001', 'DISPONIBLE', 'Laboratorio 1');

INSERT INTO EQUIPOS (nombre, tipo, serial, estado, observacion) 
VALUES ('Proyector Epson EB-X06', 'Proyector', 'EPS-2026-002', 'DISPONIBLE', 'Sala de reuniones');

INSERT INTO EQUIPOS (nombre, tipo, serial, estado, observacion) 
VALUES ('Tablet Samsung Galaxy Tab', 'Tablet', 'SAM-2026-003', 'MANTENIMIENTO', 'Pantalla astillada');

COMMIT;