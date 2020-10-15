var router = require('express').Router();
var userRouter = require('./user.js');
var uploadRouter = require('./upload.js');
var reportRouter = require('./report.js');
var banRouter = require('./ban');
router.use('/user', userRouter);
router.use('/upload', uploadRouter);
router.use('/report', reportRouter);
router.use('/ban', banRouter);

module.exports = router;