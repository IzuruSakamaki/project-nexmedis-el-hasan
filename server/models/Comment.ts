import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/db';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
}

Comment.init(
  {
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

export default Comment;