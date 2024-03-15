'use strict';

const Task = require('../../models/task');
const User = require('../../models/user');
const Status = require('../../models/status');
const Comment = require('../../models/comment');

Task.belongsTo(User, { foreignKey: 'id_user' });
Task.belongsTo(Status, { foreignKey: 'id_status' });
Task.hasMany(Comment, { foreignKey: 'id_task' });

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
                    },{
                        model: Comment,
                        separate: true
                    }]
                });
            } else if (role === 'executioner') {
                tasks = await Task.findAll({
                    where: { id_user },
                    include: [{
                        model: User,
                        attributes: ['id', 'email', 'name', 'last_name', 'role']
                    },{
                        model: Status,
                        attributes: ['id', 'status']
                    },{
                        model: Comment,
                        separate: true
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
                    id_status: task.id_status,
                    id_user: task.id_user,
                    due_date: task.due_date,
                    created: task.created,
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
                    },
                    comments: task.comments.map(comment => {
                        return {
                            id: comment.id,
                            id_user: comment.id_user,
                            id_task: comment.id_task,
                            comment: comment.comment,
                            created: comment.created
                        };
                    })
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
    },

    add_comment: async (data) => {
        try{
            let comment_data = {
                id_user: data.id_user,
                id_task: data.id_task,
                comment: data.comment,
            };
            let user_data = await user_functions.findUserById(comment_data.id_user);
            //User does not exist
            if (user_data == false) {
                return false;
            }else{
                let comment = await Comment.create(comment_data).then(saved_comment => {
                    if (!saved_comment) return false;
                    return saved_comment;
                });
                return comment;
            }
        }catch(err){
            return false;
        }
    },

    change_status: async (user_data, task_id, new_status_id) => {
        try {
            const task = await Task.findByPk(task_id);

            if (!task) {
                return false;
            }

            if (user_data.role === 'executioner' && task.id_user !== user_data.id) {
                return false;
            }

            task.id_status = new_status_id;

            await task.save();

            return task;
        } catch (err) {
            return false;
        }
    }

}
module.exports = task_functions;