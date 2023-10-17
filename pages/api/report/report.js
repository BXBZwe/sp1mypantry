import {connect,  Schema, model, models } from "mongoose";
import {Post} from '../post/recipe'
import {Recycle} from '../post/recycle'
import {User} from '../auth/signup'

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);

    if (req.method === 'POST') {
        try {
            console.log('Post ID:', req.body.id);
            console.log('User ID:', req.body.reportedBy);
            console.log("Request Body:", req.body);

            const recipepost = await Post.findById(req.body.id)
            const user = await User.findById(req.body.reportedBy)
            const report = await Report.create({
                ...req.body,
                reportedName: user.name,
                receipeDetails: {
                    name: recipepost.name,
                    description: recipepost.description,
                    prepTime: recipepost.prepTime,
                    servings: recipepost.servings,
                    cookTime: recipepost.cookTime,
                    origin: recipepost.origin,
                    taste: recipepost.taste,
                    mealtype: recipepost.mealtype,
                    instruction: recipepost.instruction,
                    ingredients: recipepost.ingredients,  
                    recipeimageUrl: recipepost.recipeimageUrl,
                    status: recipepost.status,
                    userId: recipepost.userId,
                    postId: recipepost.id
                },
            });
            res.status(201).json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } 
    else if (req.method === 'GET') {
        try {
            const reportId = req.query.reportId;

            if (reportId) {
                const report = await Report.findById(reportId).select('-reportedBy').lean().exec();

                if (!report) {
                    return res.status(404).json({ error: "Report not found" });
                }

                if (report.postType === 'recipe') {
                    report.postDetails = await Post.findById(report.postId).lean().exec();
                } else if (report.postType === 'recycle') {
                    report.postDetails = await Recycle.findById(report.postId).lean().exec();
                }

                return res.status(200).json(report);
            } else {
                const reports = await Report.find({}).lean().exec();
                
                for (let report of reports) {
                    if (report.postType === 'recipe') {
                        report.postDetails = await Post.findById(report.postId).lean().exec();
                    } else if (report.postType === 'recycle') {
                        report.postDetails = await Recycle.findById(report.postId).lean().exec();
                    }
                }

                return res.status(200).json(reports);
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const ingredientSchema = new Schema({
    name: String,
    quantity: Number,
    unit: String,
    category: {
        type: String,
        enum: [
            'MEAT', 'VEGETABLES', 'SPICES_HERBS', 'LIQUIDS', 'GRAINS_STARCHES', 'DAIRY',
            'OILS', 'SUGARS_SWEETENERS', 'FRUITS', 'NUTS',
            'SAUCES', 'BAKING_INGREDIENTS', 'ALCOHOL', 'OTHERS'],
    }
});

const ReportSchema = new Schema({
    postId: Schema.Types.ObjectId,
    postType: {
        type: String,
        enum: ['recipe', 'recycle']
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'Usercollection' },  
    reason: String,
    additionalDetails: String,
    dateReported: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['open', 'resolved'],
        default: 'open'
    },
    adminAction: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    reportedName: String,
    receipeDetails: {
        name: String,
        description: String,
        prepTime: String,
        servings: Number,
        cookTime: String,
        origin: String,
        taste: String,
        mealtype: String,
        instruction: String,
        ingredients: [ingredientSchema],
        recipeimageUrl: String,
        status: String,
        userId: String,
        postId: String,
    },
    adminComment: String,
    adminId: { type: Schema.Types.ObjectId, ref: 'Usercollection' },
});

const Report = models?.reports || model('reports', ReportSchema);

export {Report};
