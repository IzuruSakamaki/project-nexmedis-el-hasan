import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/db';

class Post extends Model {
  public id!: number;
  public content!: string;
  public imageUrl!: string | null;
  public userId!: number;
}

Post.init(
  {
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

export default Post;