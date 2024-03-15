'use strict';

const Task = require('../../models/task');
const user = require('../user');
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

}
module.exports = task_functions;