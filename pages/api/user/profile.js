import { connect, model } from 'mongoose';
import {User} from '../auth/signup';
import { verify } from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'GET') {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1]; 

    try {
      const payload = verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(payload.userId);
      if (!user){
        return res.status(404).json({ error: 'User not found' });
      }
      const { name, email, phone, imageUrl } = user;
      return res.status(200).json({ name, email, phone, imageUrl });
    } catch (error){
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  else if (req.method === 'POST') {
    const { imageUrl } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const payload = verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(payload.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.imageUrl = imageUrl;
      await user.save();
  
      return res.status(200).json({ success: true, message: 'Image URL saved successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
