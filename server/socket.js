const io = require('socket.io')();

io.on('connection', (socket) => {

    socket.on('disconnect', () => {

    });
});

module.exports = io;