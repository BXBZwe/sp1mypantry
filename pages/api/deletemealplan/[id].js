import { connect } from "mongoose";
import { MealPlan } from "../mealplanner/mealplanner";
import jwt from 'jsonwebtoken';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
  await connect(connectionString);

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const planId = req.query.id;

  try {
    const result = await MealPlan.deleteOne({ _id: planId, userId }); 
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    return res.status(200).json({ message: 'Meal plan deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
