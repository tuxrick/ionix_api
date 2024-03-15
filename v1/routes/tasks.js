const controller = require('../controllers/task/index');
const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {

    router.route('/create_task')
        .post(verifyToken, controller.create_task);

    return router;
}