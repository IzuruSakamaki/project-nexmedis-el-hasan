import express from 'express';
import { createPost, getPosts, deletePost, getPostDetails, updatePost, getPostsByUser } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getPostVoteByUser, votePost } from '../controllers/voteController';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', authMiddleware, getPostDetails);
router.get('/user/all', authMiddleware, getPostsByUser);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.put('/:id/vote', authMiddleware, votePost);
router.get('/:id/vote', authMiddleware, getPostVoteByUser);
router.delete('/:id', authMiddleware, deletePost);

export default router;