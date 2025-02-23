import { Request, Response } from 'express';
import Comment from '../models/Comment';
import { errorHandler } from '../utils/errorHandler';
import User from '../models/User';

export const createComment = async (req: Request, res: Response) => {
  const { content, postId } = req.body;
  const userId = (req as any).user.id;
  try {
    const comment = await Comment.create({ content, userId, postId });
    const commentWithUser = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
      ],
    });
    res.status(201).json(commentWithUser);
  } catch (error) {
    errorHandler(res, 500, 'Failed to create comment');
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  try {
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) {
      return errorHandler(res, 404, 'Comment not found');
    }
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    errorHandler(res, 500, 'Failed to delete comment');
  }
};