import { DataTypes, Model } from 'sequelize';
import User from './User';
import Post from './Post';
import sequelize from '../configs/database';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'comment',
    timestamps: true,
  }
);

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
});

export default Comment;