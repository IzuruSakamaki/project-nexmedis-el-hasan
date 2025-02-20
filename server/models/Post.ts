import { Model } from 'sequelize';

class Post extends Model {
  public id!: number;
  public content!: string;
  public imageUrl!: string | null;
  public vote!: number;
  public userId!: number;
}

export default Post;