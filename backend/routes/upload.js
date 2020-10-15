var router = require('express').Router()
var	uploadCtrl = require('../controllers/upload.js')
var	verifyToken = require('../serverAuth.js').verifyToken

router.route('/test').get((req, res)=>res.send("user Test"))

router.route('/avatar').post(uploadCtrl.avatar);

router.route('/image').post(uploadCtrl.image);

module.exports = router