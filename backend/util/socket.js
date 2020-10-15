
const io = require('socket.io');
const users = require('./users');
/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
makeCalls = async () => {
  if(users.getSize() === 0) return;
  const us = users.getUsers();
  let cnt = 0;
  for(let id in us){
    if(us[id].status === 'true') cnt++;
  }
  if(cnt === 0) return;
  console.log('-current available number of users: ', cnt);
  let match = {};
  for(let id in us){
    let user = us[id];
    if(user.status === 'false') continue;
    let pair = await users.getIdleUserId(id);
    if(pair) match[id] = pair;
  }
  for(var id in match){
    if(users.check(id) && users.check(match[id])) {
      console.log('match: ', id, "-", match[id]);
      users.getSocket(id).emit('finding', match[id]);
    }
  }
}


function initSocket(socket) {
  let id;
  console.log("new socket connect, now number of connections...", users.getSize());
  socket
    .on('init', (_id) => {
      try{
        id = _id;
        users.create(socket, id);
        console.log("-init socket..from", id,"user size: ", users.getSize());
        socket.emit('init', { id });
      }catch(err){
        console.log(err);
      }
    })
    .on('request', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      if(!users.check(data.to)){socket.emit('end', 'fromServerSocket');return;}
      console.log('-Call request form ', id,"to: ", data.to);

      const receiver = users.get(data.to);
      if (receiver) {
        receiver.socket.emit('request', { from: id });
      }
    })
    .on('call', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      if(!users.check(data.to)){socket.emit('end', 'fromServerSocket');return;}
      // console.log('call from ', id, "to: ", data.to, data);
      
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.socket.emit('call', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('end', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      if(!users.check(data.to)){return;}
      console.log('-End request from ', id, 'to', data.to);

      const receiver = users.get(data.to);
      if (receiver) {
        receiver.socket.emit('end', id);
      }
    })
    .on('finding', () => {
      if(!users.check(id)){socket.emit('reset');return;}
      console.log('-Finding request...from ', id);       
      users.setStatus(id, 'true');
      if(users.get(id).status === 'false') socket.emit('finding', 'null');
    })
    .on('disconnect', () => {
      console.log(id, 'disconnected');
      users.remove(id);
    })
    .on('new_msg', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      if(!users.check(data.to)){socket.emit('end', 'fromServerSocket');return;}
      console.log('new message from ', id, "to: ", data.to, data.msg);

      const receiver = users.get(data.to);
      if (receiver) {
        receiver.socket.emit('new_msg', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('msg_typing', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      if(!users.check(data.to)){socket.emit('end', 'fromServerSocket');return;}
      console.log('-New typing from ', id, "to: ", data.to, data.status);

      const receiver = users.get(data.to);
      if (receiver) {
        receiver.socket.emit('msg_typing', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('filter', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      console.log("-Filter registered from..", id, data);
      users.setFilter(id, data);
    })
    .on('report', (data) => {
      if(!users.check(id)){socket.emit('reset');return;}
      console.log('report from ...', id, data);
    })
    .on('admin_getUsers', () => {
      console.log('request from admin...getUsers');
      socket.emit('admin_getUsers', users.getAdminUsers());
    })
}

module.exports = (server) => {
  io({serveClient: false }).listen(server, { log: true }).on('connection', initSocket);
  setInterval(makeCalls, 3000);
};
