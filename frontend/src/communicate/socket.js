import io from 'socket.io-client';
const ENDPOINT = process.env.REACT_APP_SOCK;
const socket = io(ENDPOINT);

export default socket;
