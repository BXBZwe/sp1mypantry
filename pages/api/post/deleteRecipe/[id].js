import { connect } from "mongoose";
import { Post } from "../recipe";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'DELETE') {

    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const recipeId = req.query.id;

    console.log("UserId and RecipeId: ", userId, recipeId); 

    try {
      const result = await Post.deleteOne({ _id: recipeId, userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({ message: 'Recipe deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
