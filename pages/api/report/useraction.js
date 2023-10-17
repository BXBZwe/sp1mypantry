import {Report} from '../report/report';  
import {connect} from "mongoose";
import {Notification} from '../notification/notification';  

const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);

    if (req.method === 'POST') {
        const { reportId } = req.body; 

        try {
            const report = await Report.findById(reportId);

            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }

            const notificationMessage = `The reported post with ID ${report.postId} has been addressed. Please review.`;
            
            await Notification.create({
                userId: process.env.ADMIN_USER_ID, 
                message: notificationMessage, 
                type: 'userAction',
                postId: report.postId
            });

            res.status(200).json({ message: "Admin will review your changes shortly." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
