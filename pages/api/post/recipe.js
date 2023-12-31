import { connect, model, models, Schema } from "mongoose";
import jwt from 'jsonwebtoken';
const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);
    console.log("req.method: ", req.method)

    if (req.method === 'GET') {
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const docs = await Post.find({ userId }); 
        res.status(200).json(docs)
    } else if (req.method === 'POST') {
        console.log(req.body);
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const doc = await Post.create({...req.body, userId});
        res.status(201).json(doc)
    } else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
} 

const ingredientSchema = new Schema({
    name: String,
    quantity: Number,
    unit: {
        type: String,
        enum: ['gram', 'pieces', 'cuts', 'cups', 'tbsp', 'tsp', 'clove', 'leaves', 'slices', 'pitch', 'ml', 'pack', 'scoop'],
    },
    category: {
        type: String,
        enum: [
            'MEAT', 'VEGETABLES', 'SPICES_HERBS', 'LIQUIDS', 'GRAINS_STARCHES', 'DAIRY',
            'OILS', 'SUGARS_SWEETENERS', 'FRUITS', 'NUTS',
            'SAUCES', 'BAKING_INGREDIENTS', 'ALCOHOL', 'OTHERS'],
    }
});
const PostSchema = new Schema({
    name: String,
    description: String,
    cookTime: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    prepTime: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    
    servings: Number,
    origin: {
        type: String,
        enum: ['Thailand', 'Myanmar', 'China', 'Japan', 'India', 'Sounth_Korea', 'Singapore', 'Vietnam', 'Malaysia']
    },
    taste: String,
    mealtype: {
        type: String,
        enum: ['Maindish','Dessert', 'Salad']
    },
    instruction: String,
    ingredients: [ingredientSchema],
    recipeimageUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['visible', 'hidden', 'underreview'],
        default: 'visible'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'Usercollection' },
});


const Post = models?.posts || model('posts', PostSchema);
export{Post};




