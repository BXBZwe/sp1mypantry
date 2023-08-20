import { connect, model, Schema } from 'mongoose';
import {User} from './signup';
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
      return res.status(200).json({ message: 'Login successful', token, userId: user._id, isAdmin: user.isAdmin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export {User};
