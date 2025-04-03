// models/message.js
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
  sender: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

mongoose.model('Message', messageSchema);