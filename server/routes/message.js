// routes/message.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Message = mongoose.model('Message');
const User = mongoose.model('User');

// Get conversations (unique users you've messaged)
router.get('/conversations', requireLogin, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(req.user._id) },
            { recipient: mongoose.Types.ObjectId(req.user._id) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', mongoose.Types.ObjectId(req.user._id)] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          userDetails: { $arrayElemAt: ['$userDetails', 0] }
        }
      }
    ]);

    // Clean up user details to only include necessary fields
    const cleanedConversations = conversations.map(conv => {
      return {
        _id: conv._id,
        lastMessage: conv.lastMessage,
        userDetails: {
          _id: conv.userDetails._id,
          name: conv.userDetails.name,
          email: conv.userDetails.email,
          photo: conv.userDetails.photo
        }
      };
    });

    res.json(cleanedConversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages between two users
router.get('/:userId', requireLogin, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { 
          sender: req.user._id, 
          recipient: req.params.userId 
        },
        { 
          sender: req.params.userId, 
          recipient: req.user._id 
        }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        sender: req.params.userId, 
        recipient: req.user._id, 
        read: false 
      },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a message
router.post('/:userId', requireLogin, async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(422).json({ error: 'Message content is required' });
  }
  
  try {
    const newMessage = new Message({
      sender: req.user._id,
      recipient: req.params.userId,
      content
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;