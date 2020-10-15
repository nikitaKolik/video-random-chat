const Report = require('../models/Report.js');
const User = require('../models/User.js')

module.exports = {
    create: async (req, res) => {
        console.log("create new report..", req.body);
        try{
            let user = await User.findOne({username: req.body.to});
            if(user){
                let report = await Report.create(req.body);
                if(report) return res.json({success: true, report});
                return res.json({success: false, message: "Can't create new report"});
            }else{
                return res.json({success: false, message: "The user dosen't exist report"});
            }
        }catch(err){
            console.log(err);
            return res.json({success: false, error: err});
        }
    },
    getAll: async (req, res) => {
        console.log('Report controller getAll...');
        try{
            let reports = await Report.find();
            if(reports) return res.json({success: true, reports: reports.map((report)=>report.toClient())});
            return res.json({success: false, message: "Can't get reports"});

        }catch(err){
            console.log(err);
            return res.json({success: false, error: err, message: "Some error occured, try again."});
        }
    },
    getFrom: async (req, res) => {
        let id = req.params.id;
        try{
            let reports = await Report.find({to: id});
            if(reports) return res.json({success: true, reports});
            return res.json({success: false, message: "Can't get reports"});

        }catch(err){
            console.log(err);
            return res.json({success: false, error: err});
        }
    }
}