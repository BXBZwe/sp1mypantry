import { Report } from '../report/report';  
import { connect } from "mongoose";
import { Notification } from '../notification/notification';  
import {Post} from '../post/recipe'

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);

    if (req.method === 'POST') {
        console.log(req.body)
        const { reportId, action, adminComment = null, currentUserId: adminId} = req.body; 
        console.log("Adminid", adminId)
        try {
            const updateData = { adminAction: action, adminId: adminId };
            console.log("The data :", updateData)
            if (adminComment) {
                updateData.adminComment = adminComment;
            }

            const report = await Report.findByIdAndUpdate(reportId, updateData, { new: true });

            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }

            if (action === 'accepted' && adminComment) {
                console.log("Report Post ID:", report.id);
                const recipepost = await Post.findByIdAndUpdate(report.id, { status: 'underreview' }, { new: true });
                if (!recipepost) {
                  return res.status(404).json({ error: "Recipe not found" });
                }                
                const notificationMessage = `Your post has been reported. Admin's Comment: ${adminComment}. Please review and make necessary changes within 24 hours to avoid post removal.`;
                
                await Notification.create({
                    userId: recipepost.userId,
                    reportId: report._id,
                    message: notificationMessage,
                    type: 'report',
                    postId: report.postId,
                    status: 'unread'
                });
            }

            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
