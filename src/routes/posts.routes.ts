import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/posts.controller';

const router = Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
