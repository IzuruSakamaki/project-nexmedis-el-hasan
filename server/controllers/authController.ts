import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { errorHandler } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const usernameRegex = /^[a-zA-Z]+$/;
  if (!username.match(usernameRegex)) {
    errorHandler(res, 400, 'Username can only contain alphabets.');
  }
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  if (username !== formattedUsername) {
    errorHandler(res, 400, 'Username must start with a capital letter, and all other letters should be lowercase.');
  }
  try {
    await User.create({ username: formattedUsername, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(`${error}`);
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
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    errorHandler(res, 500, 'Login failed');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return errorHandler(res, 404, 'User not found');
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to delete user');
  }
};