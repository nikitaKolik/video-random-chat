import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL + '/report';

const ReportService = {
    sendReport: (report) => {
        return axios.post(API_URL, {...report}).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
            return {success: 'false', message: 'Some errors occured, try again'};
        });
    },
    getAll : async (token) => {
        try{
          var response = await axios.get(API_URL + '/getAll', {headers: {token}});
          return response.data;
        }catch(err){
          console.log(err);
          return {success: false, error: "some errors occured in client side"};
        }
    }
}

export default ReportService;
