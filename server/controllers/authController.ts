import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { errorHandler } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    await User.create({ username: username, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(`${error}`)
    errorHandler(res, 500, 'Registration failed');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      return errorHandler(res, 401, 'Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    errorHandler(res, 500, 'Login failed');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return errorHandler(res, 404, 'User not found');
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to delete user');
  }
};