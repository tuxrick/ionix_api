const Joi = require('@hapi/joi');
const requests = require('../../utils/requests');

//User functions
const task_functions = require('./functions');

module.exports = {

    create_task: async (req, res) => {
          
        const user_data = req.decoded;

        let data = {
            id_user: req.body.id_user,
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date
        };

          //Validating role
        if (user_data.role != "admin") {
            return requests.error_response(req, res, {}, "You are not allowed to do this action");
        }

        const schema = Joi.object({
            id_user: Joi.string().min(1).required(),
            title: Joi.string().min(1).max(255).required(),
            description: Joi.string(),
            due_date: Joi.string().required()
        });
          
        const { error } = schema.validate(data);
          
        if (error) {
            return requests.error_response(req, res, error, "Wrong data");
        }
      
        let task = await task_functions.create_task(data);

        if (task !== false) {
            return requests.success_response(req, res, task, "success request");
        }else{
            return requests.error_response(req, res, {}, "Wrong data");
        }
    },

    list_tasks: async (req, res) => {

        const user_data = req.decoded;

        console.log(user_data);

        //Validating role
        if (user_data.role != "admin") {
            return requests.error_response(req, res, {}, "You are not allowed to do this action");
        }

        const tasks_list = await task_functions.list_tasks(user_data.id, user_data.role);

        if (tasks_list !== false) {
            return requests.success_response(req, res, tasks_list, "success request");
        }else{
            return requests.error_response(req, res, {}, "Wrong data");
        }
    },
}