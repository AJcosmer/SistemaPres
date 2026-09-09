process.env.NLS_LANG = 'AMERICAN_AMERICA.AL32UTF8';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import equiposRoutes from './routes/equiposRoutes.js';
import prestamosRoutes from './routes/prestamosRoutes.js';

dotenv.config();

// Configuración de rutas para archivos estáticos en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir los archivos del Frontend (CSS, JS, HTML)
// Ajusta '../frontend' según la ubicación de index.js respecto a la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Declaración de Endpoints REST
app.use('/api/equipos', equiposRoutes);
app.use('/api/prestamos', prestamosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor API REST corriendo en http://localhost:${PORT}`);
});