'use strict';

const Task = require('../../models/task');
const User = require('../../models/user');
const Status = require('../../models/status');

Task.belongsTo(User, { foreignKey: 'id_user' });
Task.belongsTo(Status, { foreignKey: 'id_status' });

const user_functions = require('../user/functions');

let task_functions = {

    create_task: async (data) => {
        try{
            let task_data = {
                id_user: data.id_user,
                title: data.title,
                description: data.description,
                due_date: new Date(data.due_date),
                id_status: 1
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
                    },{
                        model: Status,
                        attributes: ['id', 'status']
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
                    id_status: task.id_status,
                    id_user: task.id_user,
                    status:{
                        id: task.status.id,
                        status: task.status.status
                    },
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
            console.error("Error listing tasks:", err);
            return false;
        }
    },

    list_status: async ()=>{
        try{
            let result = await Status.findAll().then(status => {
                if (!status) return false;
                return status.map(status => status.toJSON());
              });
            return result;
        }catch(err){
            return false;
        }
    }
}
module.exports = task_functions;