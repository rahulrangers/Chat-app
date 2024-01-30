
import { io, Socket } from 'socket.io-client';

const createSocketConnection = (userId: string ): Socket => {
  return io('http://localhost:5000', {
    auth: {
      id: userId,
    },
  });
};

export default createSocketConnection;
