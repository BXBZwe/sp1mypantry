import { connect } from "mongoose";
import { Post } from "../recipe";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'PUT') {
    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const recipeId = req.query.id;
    const updatedData = req.body;

    try {
      const result = await Post.updateOne({ _id: recipeId, userId }, updatedData);

      if (result.nModified === 0) {
        return res.status(404).json({ error: 'Recipe not found or not modified' });
      }

      return res.status(200).json({ message: 'Recipe updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
