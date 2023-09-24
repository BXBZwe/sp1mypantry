import {connect,  Schema, model, models } from "mongoose";
const connectionString = process.env.MONGODB_URI_TM

export default async function handler(req, res) {
    await connect(connectionString);

    if (req.method === 'GET') {
        const userId = req.query.userId; 
        const notifications = await Notification.find({ userId: userId, status: 'unread' });
        res.status(200).json(notifications);
    } 
    else if (req.method === 'POST') {
      try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    else if (req.method === 'PUT') {
      const { notificationId, status } = req.body;
    
      try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { status }, { new: true });
        if (!notification) {
          return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json(notification);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    
    
    else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Usercollection' },
    reportId: { type: Schema.Types.ObjectId, ref: 'reports' },
    message: String,
    type: { type: String, enum: ['user', 'report', 'admin'] }, 
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    postId: Schema.Types.ObjectId
});

const Notification = models?.notification || model('notification', NotificationSchema);
export { Notification };
