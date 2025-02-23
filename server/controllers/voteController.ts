import { Request, Response } from 'express';
import Post from '../models/Post';
import { errorHandler } from '../utils/errorHandler';
import { Sequelize } from 'sequelize';
import Vote from '../models/Vote';

export const getPostVoteByUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    try {
        const vote = await Vote.findOne({
            where: { userId, postId: id }
        });
        if (vote) {
            if (vote.counter === 1) {
                res.json({vote: 1})
            }
            else if (vote.counter === 0) {
                res.json({vote: 0})
            }
            else if (vote.counter === -1) {
                res.json({vote: -1})
            }
        } else {
            errorHandler(res, 400, 'Failed to fetch posts');
        }
    } catch (error) {
      errorHandler(res, 500, 'Failed to fetch posts');
    }
};

export const votePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { vote } = req.body;
    const userId = (req as any).user.id;
    let stateVote = 0;
  
    try {
      if (vote !== 1 && vote !== -1) {
        return errorHandler(res, 400, 'Invalid vote value, must be 1 or -1');
      }
      const existingVote = await Vote.findOne({
        where: {
          userId,
          postId: id,
        },
      });
  
      if (existingVote) {
        if ((existingVote.counter === 0 || existingVote.counter === -1) && vote === 1) {
          existingVote.counter++;
          stateVote = 1;
        } else if ((existingVote.counter === 0 || existingVote.counter === 1) && vote === -1) {
          existingVote.counter--;
          stateVote = -1;
        }
        await existingVote.save();
      } else {
        await Vote.create({
          userId,
          postId: id,
          counter: vote,
        });
        stateVote = vote;
      }
  
      await Post.update(
        { vote: Sequelize.literal(`vote + ${stateVote}`) },
        { where: { id } }
      );
  
      res.json({ message: 'Post voted successfully' });
    } catch (error) {
      errorHandler(res, 500, 'Failed to vote post');
    }
};