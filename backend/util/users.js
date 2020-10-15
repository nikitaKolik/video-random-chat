/* eslint-disable no-await-in-loop */
const User = require('../models/User.js');

const users = {};
const flag = {};
exports.create = (socket, id) => {
  users[id] = {socket, status: "true"};
  flag[id] = {};
};
checkFilter = async (id1, id2) => {
  console.log('filtering-> between', id1, id2, users[id1].filter, users[id2].filter);
  let filter, user;
  if(users[id1]['filter']){
    filter = users[id1]['filter'];
    try{
      user = await User.findById(id2);
      console.log("user2: ", user.location, user.age, user.gender);
      if(filter.location !== user.location) return false;
      if(filter.ageMin > user.age || filter.ageMax < user.age) return false;
      if(filter.gender !== 'all' && filter.gender !== user.gender) return false;
    }catch(err){return false;}
  }
  if(users[id2]['filter']){
    filter = users[id2]['filter'];
    try{
      user = await User.findById(id1);
      console.log("user1: ", user.location, user.age, user.gender);
      if(filter.location !== user.location) return false;
      if(filter.ageMin > user.age || filter.ageMax < user.age) return false;
      if(filter.gender !== 'all' && filter.gender !== user.gender) return false;
    }catch(err){return false;}
  }
  console.log('filtering success-> between', id1, id2);
  return true;
}
exports.getIdleUserId = async (userId) => {
  let mn = Infinity;
  let selectedId = null;
  for(let id in users){
    if(id === userId || users[id].status === 'false') {continue;}
    if(flag[userId][id] === undefined){
      if(!(await checkFilter(userId, id))) continue;
      selectedId = id;
      break;
    }else if(mn > flag[userId][id]){
      if(!(await checkFilter(userId, id))) continue;
      selectedId = id;
      mn = flag[userId][id];
    }
  }
  if(selectedId !== null){
    users[userId].status = 'false';
    users[selectedId].status = 'false';
    if(flag[selectedId][userId]) flag[selectedId][userId]++;
    else flag[selectedId][userId] = 1;
    if(flag[userId][selectedId])  flag[userId][selectedId]++;
    else  flag[userId][selectedId] = 1;
    return selectedId;
  }
  return null;
}
exports.setStatus = (id, status) => {
  for(let i in users){
    console.log("current users: ", i, users[i].status, (id === i ? "====":''));
  }
  if(users[id]){
    users[id]['status'] = status;
    return id;
  }else return null;
}
exports.clearFlag = (id) => {
  flag[userId] = {};
}
exports.get = (id) => users[id];

exports.remove = (id) => {
  delete users[id];
  delete flag[id];
}
exports.check = (id) => {
  if(users[id]) return true;
  return false;
}
exports.getSize = () => Object.keys(users).length;
exports.getUsers = () =>users;
exports.getSocket = (id) => users[id].socket;
exports.setFilter = (id, filter) => {
  users[id]['filter'] = filter; 
}
exports.getAdminUsers = () => {
  let currentUsers = [];
  for(let id in users){
    user = users[id];
    currentUsers.push({
      username: id,
      ip: user.socket.handshake.address,
    });
  }
  return currentUsers;
}