var router = require('express').Router()
var reportCtrl = require('../controllers/report.js');

router
.post('/', reportCtrl.create)
.get('/getAll', reportCtrl.getAll)
.get('/:id', reportCtrl.getFrom);

module.exports = router
