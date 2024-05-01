import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://192.168.1.66:4000", {
	autoConnect: false,
});
