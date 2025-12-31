import { Router } from 'express';
import {
    getAllPages,
    getPageBySlug,
    createPage,
    updatePage,
    deletePage,
} from '../controllers/pages.controller';

const router = Router();

router.get('/', getAllPages);
router.get('/:slug', getPageBySlug);
router.post('/', createPage);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

export default router;
