var router = require('express').Router()
var banCtrl = require('../controllers/ban.js');

router
.post('/', banCtrl.createOne)
.get('/getAll', banCtrl.getAll)
.delete('/', banCtrl.deleteOne)
.post('/account/:userId', banCtrl.createAccountOne)
.delete('/account/:userId', banCtrl.deleteAccountOne)
module.exports = router
