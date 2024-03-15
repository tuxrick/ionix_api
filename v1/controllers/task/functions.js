'use strict';

const Task = require('../../models/task');
const User = require('../../models/user');
Task.belongsTo(User, { foreignKey: 'id_user' });

const user_functions = require('../user/functions');

let task_functions = {

    create_task: async (data) => {
        try{
            let task_data = {
                id_user: data.id_user,
                title: data.title,
                description: data.description,
                due_date: new Date(data.due_date),
                status: "Assigned"
            };
            let user_data = await user_functions.findUserById(data.id_user);
            //User does not exist
            if (user_data == false) {
                return false;
            }else{
                let task = await Task.create(task_data).then(task => {
                    if (!task) return false;
                    return task;
                });
                return task;
            }
        }catch(err){
            return false;
        }
    },

    list_tasks: async (id_user, role) => {
        try {
            let tasks;
            
            if (role === 'admin') {
                tasks = await Task.findAll({
                    include: [{
                        model: User,
                        attributes: ['id', 'email', 'name', 'last_name', 'role']
                    }]
                });
            } else if (role === 'executioner') {
                tasks = await Task.findAll({
                    where: { id_user },
                    include: [{
                        model: User,
                        attributes: ['id', 'email', 'name', 'last_name', 'role']
                    }]
                });
            } else {
                return false;
            }

            const formattedTasks = tasks.map(task => {
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    due_date: task.due_date,
                    status: task.status,
                    user: {
                        id: task.user.id,
                        email: task.user.email,
                        name: task.user.name,
                        last_name: task.user.last_name,
                        role: task.user.role
                    }
                };
            });

            return formattedTasks;
        } catch (err) {
            console.error("Error al listar las tareas con usuarios:", err);
            return false;
        }
    }


}
module.exports = task_functions;