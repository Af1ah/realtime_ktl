'use client';

import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface WebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  subscribe: (channel: string, callback: (data: any) => void) => void;
  unsubscribe: (channel: string) => void;
  emit: (event: string, data: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token: string) => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  subscribe: (channel: string, callback: (data: any) => void) => {
    const { socket } = get();
    if (socket) {
      socket.on(channel, callback);
    }
  },

  unsubscribe: (channel: string) => {
    const { socket } = get();
    if (socket) {
      socket.off(channel);
    }
  },

  emit: (event: string, data: any) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit(event, data);
    }
  },
}));