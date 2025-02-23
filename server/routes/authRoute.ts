import express from 'express';
import { register, login, deleteUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/', authMiddleware, deleteUser);

export default router;