import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL+`/user`;

class AuthService {
  login = async (user) => {
    var response = await axios.post(API_URL+'/login', user);
    return response.data;
  }

  logout = async (user) => {
    localStorage.removeItem("user");
    console.log('log out..');
    if(user) axios
      .post(API_URL+'/logout', {}, {headers: {token: user.token} } );
  }

  register = async (user) => {
    var response = await axios.post(API_URL, user);
    return response.data;
  }

  authenticate = async (token) => {
    var response = await axios.post(API_URL + '/authenticate', {}, {headers: {token}});
    if(response.data.sucess === 'true') return true;
    else return false;
  }
  getFriendInfo = async (id, token) => {
    var response = await axios.post(API_URL + '/getAUser', {id}, {headers: {token}});
    return response.data;
  }
  update = async (user, token) => {
    var response = await axios.post(API_URL + '/update', {user}, {headers: {token}});
    return response.data;
  }
  getAll = async (token) => {
    try{
      var response = await axios.get(API_URL + '/getAll', {headers: {token}});
      return response.data;
    }catch(err){
      console.log(err);
      return {success: false, error: "some errors occured in client side"};
    }
  }
}

export default new AuthService();
