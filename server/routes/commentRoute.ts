import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

router.post('/', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;