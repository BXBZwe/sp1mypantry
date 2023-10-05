import { connect, model, models, Schema } from 'mongoose';

const connectionString = process.env.MONGODB_URI_TM;

const UsersSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  recipewishlist: [{
    type: Schema.Types.ObjectId,
    ref:'posts'
  }],
  recyclewishlist: [{
    type: Schema.Types.ObjectId,
    ref:'recycles'
  }],
  imageUrl: {
    type: String,
    default: ''
  },
});

const User = models?.Usercollection || model('Usercollection', UsersSchema);

export default async function handler(req, res) {
  await connect(connectionString);

  try {
    let user;

    if (req.method === 'POST') {
      user = await User.create(req.body);
      if (!user) {
        return res.status(400).json({ status: 'Unable to create user' });
      }
      return res.status(200).json({ status: 'User created successfully' });
    } else if (req.method === 'GET') {
      user = await User.findOne({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ status: 'User not found' });
      }
    } else {
      return res.status(405).json({ status: 'Method not allowed' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 'Not able to create a new user' });
  }
}

export {User};