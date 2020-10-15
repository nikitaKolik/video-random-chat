const User = require('../models/User.js');

module.exports = {
    image: (req, res) => {
        console.log("....file uploading general....");
        if (!req.files) {
            return res.status(500).send({ msg: "file is not found" })
        }
        const myFile = req.files.file;
        const ext = myFile.name.split('.').pop();
        const filename = "image" + Math.floor(Math.random() * 999999) +  Math.floor(Math.random() * 999999);
        myFile.mv(`${__dirname}/../public/images/${filename}.${ext}`, function (err) {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "Error occured" });
            }
            // returing the response with file path and name
            return res.send({success: 'true', name: myFile.name, path: `/public/images/${filename}.${ext}`});
        })   
    },
    avatar: (req, res) => {
        console.log("....file uploading avatar....");
        if (!req.files) {
            return res.status(500).send({ msg: "file is not found" })
        }
        const myFile = req.files.file;
        const ext = myFile.name.split('.').pop();
        const filename = "avatar" + Math.floor(Math.random() * 999999) +  Math.floor(Math.random() * 999999);
        myFile.mv(`${__dirname}/../public/avatar/${filename}.${ext}`, function (err) {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "Error occured" });
            }
            // returing the response with file path and name
            console.log( `/public/avatar/${filename}.${ext}`);
            return res.send({success: 'true', name: myFile.name, path: `/public/avatar/${filename}.${ext}`});
        })   
    }
}