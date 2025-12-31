import { Router, Request, Response } from 'express';
import pagesRoutes from './pages.routes';
import postsRoutes from './posts.routes';
import portfolioRoutes from './portfolio.routes';
import servicesRoutes from './services.routes';
import membersRoutes from './members.routes';
import mediaRoutes from './media.routes';
import authRoutes from './auth.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/pages', authMiddleware, pagesRoutes);
router.use('/posts', authMiddleware, postsRoutes);
router.use('/portfolio', authMiddleware, portfolioRoutes);
router.use('/services', authMiddleware, servicesRoutes);
router.use('/members', authMiddleware, membersRoutes);
router.use('/media', authMiddleware, mediaRoutes);

export default router;

