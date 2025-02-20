import { Model } from 'sequelize';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
}

export default Comment;