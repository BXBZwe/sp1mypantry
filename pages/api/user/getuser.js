import { connect, model } from 'mongoose';
import {User} from '../auth/signup';
const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'GET') {

    const docs = await User.find();
    res.status(200).json(docs);
  }
  else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
