import express from 'express';
import { createPost, getPosts, deletePost } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.delete('/:id', authMiddleware, deletePost);

export default router;