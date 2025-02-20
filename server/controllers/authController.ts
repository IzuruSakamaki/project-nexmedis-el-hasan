import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { errorHandler } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
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