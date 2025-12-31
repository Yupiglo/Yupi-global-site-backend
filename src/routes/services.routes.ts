import { Router } from 'express';
import { getAllServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/services.controller';

const router = Router();

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
