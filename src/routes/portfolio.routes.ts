import { Router } from 'express';
import { getAllPortfolioItems, getPortfolioBySlug, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../controllers/portfolio.controller';

const router = Router();

router.get('/', getAllPortfolioItems);
router.get('/:slug', getPortfolioBySlug);
router.post('/', createPortfolioItem);
router.put('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);

export default router;
