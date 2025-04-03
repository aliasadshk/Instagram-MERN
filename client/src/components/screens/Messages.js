import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App';
import io from 'socket.io-client';
import './Message.css';

const Message = () => {
  const { state } = useContext(userContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Your backend URL
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join the socket room with user ID
  useEffect(() => {
    if (socket && state) {
      socket.emit('join', state._id);

      // Listen for new messages
      socket.on('newMessage', (data) => {
        if (currentChat && data.senderId === currentChat._id) {
          setMessages((prev) => [...prev, data]);
        }
        // Refresh conversation list to update latest message
        fetchConversations();
      });

      // Listen for typing indicator
      socket.on('userTyping', (data) => {
        // Handle typing indicator - could add a visual cue
      });
    }
  }, [socket, state, currentChat]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!state) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/messages/conversations', {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await res.json();
      setConversations(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  // Load conversations on component mount
  useEffect(() => {
    if (state) {
      fetchConversations();
    }
  }, [state]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat && state) {
        try {
          const res = await fetch(`/api/messages/${currentChat._id}`, {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
          });
          
          if (!res.ok) {
            throw new Error('Failed to fetch messages');
          }
          
          const data = await res.json();
          setMessages(data);
        } catch (err) {
          console.error(err);
          setError('Failed to load messages');
        }
      }
    };
    getMessages();
  }, [currentChat, state]);

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || !state) return;

    const messageData = {
      content: newMessage
    };

    try {
      // Send to backend
      const res = await fetch(`/api/messages/${currentChat._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify(messageData)
      });
      
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await res.json();

      // Send to socket
      socket.emit('sendMessage', {
        senderId: state._id,
        recipientId: currentChat._id,
        content: newMessage
      });

      // Update local state
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (socket && currentChat && state) {
      socket.emit('typing', {
        senderId: state._id,
        recipientId: currentChat._id
      });
    }
  };

  // Format time distance
  const formatTimeDistance = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-sidebar">
        <h2>Messages</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p>No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`conversation-item ${currentChat?._id === conv._id ? 'active' : ''}`}
                  onClick={() => setCurrentChat(conv.userDetails)}
                >
                  <div className="conversation-avatar">
                    <img
                      src={conv.userDetails.photo || "https://res.cloudinary.com/yourusername/image/upload/v1596096954/default-avatar_dqblbx.png"}
                      alt={`${conv.userDetails.name}'s avatar`}
                    />
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3>{conv.userDetails.name}</h3>
                      <span className="time">
                        {formatTimeDistance(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="last-message">
                      {conv.lastMessage.sender === state._id ? 'You: ' : ''}
                      {conv.lastMessage.content.length > 25
                        ? conv.lastMessage.content.substring(0, 25) + '...'
                        : conv.lastMessage.content}
                    </p>
                    {/* Unread indicator */}
                    {conv.lastMessage.sender !== state._id && !conv.lastMessage.read && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="chat-area">
        {currentChat ? (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-user-info">
                <img
                  src={currentChat.photo || "https://res.cloudinary.com/yourusername/image/upload/v1596096954/default-avatar_dqblbx.png"}
                  alt={`${currentChat.name}'s avatar`}
                />
                <h3>{currentChat.name}</h3>
              </div>
            </div>

            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender === state._id ? 'outgoing' : 'incoming'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {formatTimeDistance(msg.createdAt)}
                      </span>
                      {msg.sender === state._id && (
                        <span className="read-status">
                          {msg.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleTyping}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                <i className="material-icons">send</i>
              </button>
            </form>
          </div>
        ) : (
          <div className="select-conversation">
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;