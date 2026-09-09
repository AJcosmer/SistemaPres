process.env.NLS_LANG = 'AMERICAN_AMERICA.AL32UTF8';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import equiposRoutes from './routes/equiposRoutes.js';
import prestamosRoutes from './routes/prestamosRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Declaración de Endpoints REST
app.use('/api/equipos', equiposRoutes);
app.use('/api/prestamos', prestamosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor API REST corriendo en http://localhost:${PORT}`);
});