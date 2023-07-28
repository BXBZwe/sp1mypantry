import { connect } from 'mongoose';
import jwt from 'jsonwebtoken';
import {User} from '../auth/signup';  

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
    await connect(connectionString);
  
    if (req.method === 'GET') {
      const token = req.headers.authorization.split(' ')[1];
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      try {
        const user = await User.findById(userId).populate('recyclewishlist');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user.recyclewishlist);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
