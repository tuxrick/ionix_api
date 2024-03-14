const controller = require('../controllers/user/index');
const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {
	
	router.route('/test')
		.get(controller.test);

	return router;
}