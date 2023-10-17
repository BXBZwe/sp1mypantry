import { connect } from 'mongoose';
import {User} from '../auth/signup';
import jwt from 'jsonwebtoken'; // JWT library for token verification

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
    await connect(connectionString);
    if (req.method === 'POST'){
      try{
        // Verifying the token and getting user data
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;
  
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({status: 'User not found'});
        }
  
        // Remove post from wishlist
        const postIndex = user.recipewishlist.indexOf(req.body.postId);
        if (postIndex > -1) {
          user.recipewishlist.splice(postIndex, 1);
          await user.save();
          res.status(200).json({ status: 'Recipe post removed from wishlist successfully.' });
        } else {
          res.status(404).json({ status: 'Post not found in the wishlist' });
        }
  
      } catch(error){
        console.error('Error in POST /wishlist/removeFromWishlist:', error);
        res.status(400).json({status: 'Recipe post not found or invalid token'});
      }
    }
  };
  