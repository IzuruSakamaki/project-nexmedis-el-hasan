import { Request, Response } from 'express';
import Post from '../models/Post';
import { errorHandler } from '../utils/errorHandler';
import { Sequelize } from 'sequelize';
import User from '../models/User';
import Comment from '../models/Comment';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
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
      where: { id, userId },
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

export const votePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { vote } = req.body;
  try {
    if (vote !== 1 && vote !== -1) {
      return errorHandler(res, 400, 'Invalid vote value, must be 1 or -1');
    }
    const [updatedCount] = await Post.update(
      { vote: Sequelize.literal(`vote + ${vote}`) },
      { where: { id } }
    );
    if (updatedCount === 0) {
      return errorHandler(res, 404, 'Post not found');
    }
    res.json({ message: 'Post voted successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to vote post');
  }
};