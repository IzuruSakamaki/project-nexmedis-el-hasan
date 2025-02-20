import express from 'express';
import { createPost, getPosts, deletePost, getPostDetails, updatePost, votePost } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', authMiddleware, getPostDetails);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.put('/:id/vote', authMiddleware, votePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;