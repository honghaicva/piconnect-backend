// file: backend/server.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Khởi tạo Socket.IO và cho phép kết nối từ mọi nơi
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi nguồn gốc kết nối, tiện cho việc phát triển
    methods: ["GET", "POST"]
  }
});

// Lắng nghe các sự kiện kết nối
io.on('connection', (socket) => {
  console.log(`Một người dùng đã kết nối với ID: ${socket.id}`);

  // Lắng nghe sự kiện 'sendMessage' từ một người dùng
  socket.on('sendMessage', (data) => {
    // 'data' sẽ là đối tượng tin nhắn, ví dụ: { author: 'userA', content: 'Xin chào!' }
    console.log(`Nhận được tin nhắn từ ${data.author}: ${data.content}`);

    // Gửi tin nhắn này tới TẤT CẢ những người dùng khác đang kết nối
    // Đây là cách đơn giản nhất, sau này chúng ta sẽ làm cho nó chỉ gửi tới người nhận cụ thể
    socket.broadcast.emit('receiveMessage', data);
  });

  // Lắng nghe khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log(`Người dùng ${socket.id} đã ngắt kết nối.`);
  });
});

const PORT = 3001; // Backend sẽ chạy ở cổng 3001
server.listen(PORT, () => {
  console.log(`Tổng đài PiConnect đang hoạt động tại cổng ${PORT}`);
});
