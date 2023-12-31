import { connect } from "mongoose";
import { Post } from "../../post/recipe";
import {User} from "../../auth/signup";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'DELETE') {

    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const recycleId = req.query.id;

    console.log("UserId and wishlistrecycleid: ", userId, recycleId); 

    try {
      const result = await User.updateOne(
        { _id: userId }, 
        { $pull: { recyclewishlist: recycleId } }
        );
      console.log("Deletion result:", result);

      if (result.nModified  === 0) {
        return res.status(404).json({ error: 'Recycle not found in Wishlist' });
      }

      return res.status(200).json({ message: 'Recycle removed from wishlist' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
