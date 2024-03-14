const controller = require('../controllers/user/index');
const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {

    router.route('/login')
        .post(controller.login);

    router.route('/register')
        .post(controller.register_user);

    router.route('/list_users')
        .get(verifyToken, controller.list_users);

    return router;
}