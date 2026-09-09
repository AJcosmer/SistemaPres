import { Router } from 'express';
import * as controller from '../controllers/equiposController.js';

const router = Router();

router.get('/', controller.listarEquipos);
router.get('/:id', controller.obtenerEquipo);
router.post('/', controller.crearEquipo);
router.put('/:id', controller.actualizarEquipo);
router.delete('/:id', controller.eliminarEquipo);

export default router;