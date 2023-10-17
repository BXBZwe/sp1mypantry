import { connect } from "mongoose";
import { Post } from '../post/recipe';
import { Report } from '../report/report';
import { Notification } from '../notification/notification';

const connectionString = process.env.MONGODB_URI_TM;

export default async function handler(req, res) {
    await connect(connectionString);
  
    if (req.method === 'DELETE') {
        console.log("Received request body:", req.body);

        const { postId, reportId, adminId } = req.body;
  
        try {
            const deletedPost = await Post.findByIdAndDelete(postId);
            
            if (!deletedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
  
            const updatedReport = await Report.findByIdAndUpdate(
                reportId, 
                { status: 'resolved', adminId }, 
                { new: true }
            );
            
            if (!updatedReport) {
                return res.status(404).json({ error: 'Report not found' });
            }
  
            await Notification.create({
                userId: adminId,
                message: `The post with ID ${postId} has been deleted. The report has been resolved.`,
                type: 'admin',
                status: 'unread' 
            });
  
            res.status(200).json({ message: 'Post deleted and report resolved.' });
        } 
        catch (error) {
            console.error("An error occurred:", error);

            res.status(500).json({ error: error.message });
        }
    } 
    else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
