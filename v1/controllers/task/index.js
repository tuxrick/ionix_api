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

    list_status: async (req, res) => {

        const status_list = await task_functions.list_status();

        if (status_list !== false) {
            return requests.success_response(req, res, status_list, "success request");
        }else{
            return requests.error_response(req, res, {}, "Wrong data");
        }
    },

    add_comment: async (req, res) => {

        const user_data = req.decoded;

        let data = {
            id_user: user_data.id,
            id_task: req.body.id_task,
            comment: req.body.comment,
        };

        console.log(data);

        const schema = Joi.object({
            id_user: Joi.number().min(1).required(),
            id_task: Joi.string().min(1).max(255).required(),
            comment: Joi.string()
        });
          
        const { error } = schema.validate(data);
          
        if (error) {
            return requests.error_response(req, res, error, "Wrong data");
        }
      
        let comment = await task_functions.add_comment(data);

        if (comment !== false) {
            return requests.success_response(req, res, comment, "success request");
        }else{
            return requests.error_response(req, res, {}, "Wrong data");
        }
    },

    change_status: async (req, res) => {

        const user_data = req.decoded;

        let data = {
            id_task: req.body.id_task,
            id_status: req.body.id_status
        };

        const schema = Joi.object({
            id_task: Joi.string().min(1).required(),
            id_status: Joi.string().min(1).required(),
        });
          
        const { error } = schema.validate(data);
          
        if (error) {
            return requests.error_response(req, res, error, "Wrong data 1");
        }
      
        let updated_task = await task_functions.change_status(user_data, data.id_task, data.id_status);

        if (updated_task !== false) {
            return requests.success_response(req, res, updated_task, "success request");
        }else{
            return requests.error_response(req, res, {}, "Wrong data 2");
        }
    },
}