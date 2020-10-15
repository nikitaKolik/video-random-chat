var router = require('express').Router();
var	usersCtrl = require('../controllers/users.js');
var	verifyToken = require('../serverAuth.js').verifyToken;

router.route('/test').get((req, res)=>res.send("user Test"));

router.route('/').post(usersCtrl.create);
router.route('/login').post(usersCtrl.login);

router.use(verifyToken);
router.post('/update', usersCtrl.update);
router.post('/getAUser', usersCtrl.getAUser);
router.post('/authenticate', usersCtrl.authenticate);
router.route('/logout').post(usersCtrl.logout);
router.route('/getAll').get(usersCtrl.getAll);
router.route('/user/:id')
	.get(usersCtrl.show)
	.patch(usersCtrl.update)
	.delete(usersCtrl.destroy)

module.exports = router