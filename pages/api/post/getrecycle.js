import { connect, model } from 'mongoose';
import {Recycle} from '../post/recycle';
const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'GET') {

    const { postId } = req.query;
    try{
        const post = await Recycle.findById(postId);
        if(!post){
            return res.status(404).json({ error: 'Recycle Post not found' });
        }
        return res.status(200).json(post);
    } catch (error){
        console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
