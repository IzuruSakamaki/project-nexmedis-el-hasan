import { Request, Response } from 'express';
import Post from '../models/Post';
import { errorHandler } from '../utils/errorHandler';

export const createPost = async (req: Request, res: Response) => {
  const { content, imageUrl } = req.body;
  const userId = (req as any).user.id; // Diambil dari middleware auth
  try {
    const post = await Post.create({ content, imageUrl, userId });
    res.status(201).json(post);
  } catch (error) {
    errorHandler(res, 500, 'Failed to create post');
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    errorHandler(res, 500, 'Failed to fetch posts');
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id; // Diambil dari middleware auth
  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return errorHandler(res, 404, 'Post not found');
    }
    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to delete post');
  }
};