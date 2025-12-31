import { Router } from 'express';
import { getAllMedia, createMedia, deleteMedia } from '../controllers/media.controller';

const router = Router();

router.get('/', getAllMedia);
router.post('/', createMedia);
router.delete('/:id', deleteMedia);

export default router;
