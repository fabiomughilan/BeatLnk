# Chat System Setup Guide

## Overview
The worldspot chat system is a real-time music-themed chat application with artist-specific rooms and beautiful animations.

## Backend Server Setup

### 1. Install Dependencies
```bash
npm install socket.io framer-motion concurrently
```

### 2. Run the Socket Server
```bash
# Run socket server only
npm run socket

# Or run both socket server and Next.js app together
npm run dev:all
```

### 3. Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Features

### 🎵 Artist-Themed Chat Rooms
- **Taylor Swift** - Storytelling pop & acoustic vibes 🎤
- **Adele** - Soulful ballads & powerhouse vocals 🎙
- **Ed Sheeran** - Loop-pedal pop & cozy melodies 🎸
- **Drake** - Moody rap & late-night feels 🎧

### 💬 Real-time Features
- **Live Messaging** - Instant message delivery
- **Typing Indicators** - Shows when someone is typing
- **Online User Count** - Displays active users per room
- **Room Switching** - Easy switching between artist rooms
- **Message History** - Persistent chat history per room

### 🎨 Beautiful UI
- **Framer Motion Animations** - Smooth transitions and effects
- **Gradient Avatars** - Color-coded user avatars
- **Glassmorphism Design** - Modern backdrop blur effects
- **Responsive Layout** - Works on all screen sizes
- **Dark/Light Mode** - Theme support

## How to Use

### 1. Start the System
```bash
# Terminal 1: Start socket server
npm run socket

# Terminal 2: Start Next.js app
npm run dev
```

### 2. Access Chat
1. Navigate to `/chat` in your browser
2. Enter a nickname
3. Choose an artist room
4. Start chatting!

### 3. Room Management
- **Switch Rooms** - Use the dropdown in the header
- **Change Nickname** - Edit in the header input
- **View Online Count** - See how many users are in each room

## Technical Details

### Socket.io Events
- `join` - Join a room with a nickname
- `setName` - Update nickname
- `message` - Send a message
- `typing` - Send typing indicator
- `online` - Receive online user count

### State Management
- **Local Storage** - Persists nickname and room choice
- **Real-time Updates** - Socket.io for live communication
- **Room-based Messages** - Messages organized by room

### Error Handling
- **Connection Status** - Shows connection state
- **Reconnection** - Automatic reconnection on disconnect
- **Fallback UI** - Graceful degradation when offline

## File Structure
```
src/app/(protected)/chat/
└── page.tsx - Complete chat implementation

server.js - Socket.io server
package.json - Updated with chat dependencies
```

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Ensure socket server is running on port 3001
   - Check `NEXT_PUBLIC_SOCKET_URL` environment variable

2. **Missing Dependencies**
   - Run `npm install` to install all dependencies
   - Ensure `socket.io-client` and `framer-motion` are installed

3. **Template Literal Errors**
   - Fixed in the updated code
   - All string interpolations now use proper template literals

### Development Tips

1. **Run Both Servers**
   ```bash
   npm run dev:all
   ```

2. **Check Console**
   - Look for socket connection messages
   - Monitor for any error messages

3. **Test Multiple Users**
   - Open multiple browser tabs
   - Test room switching and messaging

## Integration with Music Features

The chat system integrates perfectly with the music verification system:
- **Artist Rooms** match the top artists from Spotify data
- **Community Discussion** around music preferences
- **Real-time Engagement** with like-minded music fans
- **Seamless Navigation** from main app to chat

## Next Steps

1. **Customize Rooms** - Add more artist rooms based on user data
2. **Enhanced Features** - Add file sharing, emoji reactions, etc.
3. **Moderation** - Add admin controls and message moderation
4. **Analytics** - Track room popularity and user engagement
