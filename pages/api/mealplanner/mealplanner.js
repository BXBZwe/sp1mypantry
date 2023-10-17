import { connect, model, models, Schema } from "mongoose";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
    await connect(connectionString);
    console.log("req.method: ", req.method);

    if (req.method === 'GET') {
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const docs = await MealPlan.find({ userId });
        res.status(200).json(docs);
    } else if (req.method === 'POST') {
        console.log(req.body);
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (req.body.weekIdentifier) {
            const weekMealPlans = req.body.plans;
            const weekIdentifier = req.body.weekIdentifier;

            let mealPlan = await MealPlan.findOne({ userId, weekIdentifier });

            if (mealPlan) {
                mealPlan.plans = weekMealPlans;
                await mealPlan.save();
            } else {
                mealPlan = await MealPlan.create({ userId, weekIdentifier, plans: weekMealPlans });
            }
            return res.status(201).json(mealPlan);

        } else {
            if (!req.body.date || !req.body.mealType || !req.body.recipeId) {
                return res.status(400).json({ error: "Required fields are missing." });
            }

            const doc = await MealPlan.create({...req.body, userId});
            return res.status(201).json(doc);
        }

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const MealPlanSchema = new Schema({
    weekIdentifier: String,
    plans: {
        type: Map, 
        of: {
            breakfast: { type: Schema.Types.ObjectId, ref: 'posts' },
            lunch: { type: Schema.Types.ObjectId, ref: 'posts' },
            dinner: { type: Schema.Types.ObjectId, ref: 'posts' }
        }
    },
    userId: { type: Schema.Types.ObjectId, ref: 'Usercollection' },
});


const MealPlan = models?.mealplans || model('mealplans', MealPlanSchema);
export { MealPlan };
