import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL + '/upload';

class UploadService {
  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file); // appending file
    return axios.post(API_URL + '/avatar', formData).then(res => {
        console.log(res);
        if(res.data.success === "true") return res.data.path;
        return null;
    }).catch(err => {
        console.log(err);
        return null;
    });
  }
  uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file); // appending file
    return axios.post(API_URL + '/image', formData).then(res => {
        console.log(res);
        if(res.data.success === "true") return res.data.path;
        return null;
    }).catch(err => {
        console.log(err);
        return null;
    });
  }
}

export default new UploadService();
