const controller = require('../controllers/task/index');
const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {

    router.route('/create_task')
        .post(verifyToken, controller.create_task);

    router.route('/list_tasks')
        .get(verifyToken, controller.list_tasks);

    router.route('/list_status')
        .get(verifyToken, controller.list_status);

    router.route('/add_comment')
        .post(verifyToken, controller.add_comment);

    router.route('/change_status')
        .post(verifyToken, controller.change_status);

    return router;
}