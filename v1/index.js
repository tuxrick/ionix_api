module.exports = function(app, router, route){
    let users = require('./routes/users.js');
    app.use(route+'/user', users(router));

    let tasks = require('./routes/tasks.js');
    app.use(route+'/task', tasks(router));

    return app;
}