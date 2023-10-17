import { connect } from 'mongoose';
import {User} from '../auth/signup';
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  
  await connect(connectionString);

  if (req.method === 'POST'){
    try{
      console.log(req.body);
      req.body = JSON.parse(req.body);
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded Token: ", decoded);
      const userId = decoded.userId;
      
      console.log('Decoded User ID:', userId);  

      const user = await User.findById(userId);
      if (!user) {
        console.error('User not found for ID:', userId); 
        return res.status(404).json({status: 'User not found'});
      }
      if (user.recipewishlist.includes(req.body.postId)) {
        return res.status(400).json("Post is already in the wishlist");
      }
      user.recipewishlist.push(req.body.postId);
      console.log(user);
      await user.save();
      res.status(200).json({ status: 'Recipe post added to wishlist successfully.' });
    } catch(error){
      console.error('Error in POST /wishlist/addrecipewishlist:', error);  
      res.status(400).json({status: 'Recipe post not found or invalid token'});
    }
  }
};

