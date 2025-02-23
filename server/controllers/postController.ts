import { Request, Response } from 'express';
import Post from '../models/Post';
import { errorHandler } from '../utils/errorHandler';
import User from '../models/User';
import Comment from '../models/Comment';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    res.json(posts);
  } catch (error) {
    errorHandler(res, 500, 'Failed to fetch posts');
  }
};

export const getPostDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    const post = await Post.findOne({ 
      where: { id },
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username'],
            },
          ],
        },
      ],
    });
    if (!post) {
      return errorHandler(res, 404, 'Post not found');
    }
    res.json(post);
  } catch (error) {
    errorHandler(res, 500, 'Failed to fetch post');
  }
};

export const getPostsByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  console.log(userId)
  try {
    const posts = await Post.findAll({ 
      where: { userId },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    res.json(posts);
  } catch (error) {
    errorHandler(res, 500, 'Failed to fetch posts');
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { content, imageUrl } = req.body;
  const userId = (req as any).user.id;
  try {
    const post = await Post.create({ content, imageUrl, userId });
    res.status(201).json(post);
  } catch (error) {
    errorHandler(res, 500, 'Failed to create post');
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, imageUrl } = req.body;
  const userId = (req as any).user.id;
  try {
    const [updatedCount] = await Post.update(
      { content, imageUrl },
      { where: { id, userId } }
    );
    if (updatedCount === 0) {
      return errorHandler(res, 404, 'Post not found');
    }
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to update post');
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
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