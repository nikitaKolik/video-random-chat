import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL + '/ban';

const BanService = {
    create: (ip, token) => {
        return axios.post(API_URL, {ip}, {headers: {token}}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
    delete: (id, token) => {
        return axios.delete(API_URL, {id}, {headers: {token}}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
    createAccount: (id, token) => {
        return axios.post(API_URL+`/account/${id}`, {}, {headers: {token}}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
    deleteAccount: (id, token) => {
        return axios.delete(API_URL + `/account/${id}`, {}, {headers: {token}}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
    getAll: (token) => {
        return axios.get(API_URL+'/getAll', {}, {headers: {token}}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
}

export default BanService;
