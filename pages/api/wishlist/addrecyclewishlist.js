import { connect } from 'mongoose';
import {User} from '../auth/signup';
import jwt from 'jsonwebtoken'; // JWT library for token verification

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  
  await connect(connectionString);

  if (req.method === 'POST'){
    try{
      // Parse the request body
      console.log(req.body);
      req.body = JSON.parse(req.body);
      // Verifying the token and getting user data
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded Token: ", decoded);
      const userId = decoded.userId;
      
      console.log('Decoded User ID:', userId);  // <-- NEW LOG STATEMENT

      const user = await User.findById(userId);
      if (!user) {
        console.error('User not found for ID:', userId);  // <-- NEW LOG STATEMENT
        return res.status(404).json({status: 'User not found'});
      }
      if (user.recyclewishlist.includes(req.body.recycleId)) {
        // Send a response indicating that the post is already in the wishlist
        return res.status(400).json({ message: "Post is already in the wishlist" });
      }
      // Add Recycle to wishlist
      user.recyclewishlist.push(req.body.recycleId);
      console.log(user);
      await user.save();
      res.status(200).json({ status: 'Recycle post added to wishlist successfully.' });
    } catch(error){
      console.error('Error in POST /wishlist/addRecyclewishlist:', error);  // <-- NEW LOG STATEMENT
      res.status(400).json({status: 'Recycle post not found or invalid token'});
    }
  }
};

