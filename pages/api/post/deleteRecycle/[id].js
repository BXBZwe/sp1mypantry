import { connect } from "mongoose";
import { Recycle } from "../recycle";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method === 'DELETE') {
    //console.log("Incoming request details: ", req.query, req.headers); // Log incoming request details

    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const recycleId = req.query.id;

    console.log("UserId and RecycleId: ", userId, recycleId); // Log userId and recycleId

    try {
      const result = await Recycle.deleteOne({ _id: recycleId, userId });

      //console.log("Delete result: ", result); // Log result of delete operation

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Recycle post not found' });
      }

      return res.status(200).json({ message: 'Recycle post deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
