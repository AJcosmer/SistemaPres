import { Router } from 'express';
import * as controller from '../controllers/prestamosController.js';

const router = Router();

router.get('/', controller.listarPrestamos);
router.post('/', controller.crearPrestamo);
router.put('/:id/devolver', controller.devolverPrestamo);

export default router;