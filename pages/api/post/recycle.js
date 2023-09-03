//import dbConnect from "@/lib/dbConnect"
//import Recycle from "@/models/Recycle"

import { connect, model, models, Schema } from "mongoose";
import jwt from 'jsonwebtoken';
const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);
    console.log("req.method: ", req.method)

    if (req.method === 'GET') {
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const docs = await Recycle.find({ userId }); 
        res.status(200).json(docs)
    } else if (req.method === 'POST') {
        // console.log(typeof(req.body))
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const doc = await Recycle.create({...req.body, userId});
        res.status(201).json(doc)
    } else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

const RecycleSchema = new Schema({
    name: String,
    description: String,
    prepTime: String,
    recycletype: {
        type: String,
        enum: ['Lee', 'Myanmar', 'China']
    },
    instruction: String,
    recycleimageUrl: {
        type: String,
        default: ''
    },
    userId: { type: Schema.Types.ObjectId, ref: 'Usercollection' },
});


const Recycle = models?.recycles || model('recycles', RecycleSchema);
export{Recycle};