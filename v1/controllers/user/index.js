const Joi = require('@hapi/joi');
const requests = require('../../utils/requests');

//User functions
const user_functions = require('./functions');

module.exports = {

    login: async (req, res) => {
  
        let user_info = {
          email: req.body.email,
          password: req.body.password
        };
        
        const schema = Joi.object({
          email: Joi.string().min(6).max(255).required().email(),
          password: Joi.string().min(6).max(1024).required(),
        });
        
        const { error } = schema.validate(user_info);
        
        if (error) {
          return requests.error_response(req, res, {}, "Wrong email or password1" );
        };
        
        let user_data = await user_functions.log_user(user_info);

        if (user_data !== false) {
          return requests.success_response(req, res, 
            {
                token: user_data.token,
                user: {
                    id: user_data.id,
                    email: user_data.email,
                    name: user_data.name,
                    last_name: user_data.last_name,
                    role: user_data.role
                }
            }, "success request" );
        }else{
          return requests.error_response(req, res, {}, "Wrong email or password2" );
        };
        
    },

    register_user: async (req, res) => {

        let user_data = {
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          last_name: req.body.last_name,
        }
    
        const schema = Joi.object({
          email: Joi.string().min(6).max(255).required().email(),
          password: Joi.string().min(6).max(1024).required(),
          name: Joi.string().min(3).max(1024).required(),
          last_name: Joi.string().min(3).max(1024)
        })
        
        const { error } = schema.validate(user_data);
        
        if (error) {
          return requests.error_response(req, res, error, "Wrong data");
        }
    
        let user = await user_functions.register_user(user_data);

        if (user !== false) {
          return requests.success_response(req, res, {}, "success request");
        }else{
          return requests.error_response(req, res, {}, "Wrong data");
        }
    },

    list_users: async (req, res) => {
        let user_list = await user_functions.list_users();
        if (user_list !== false) {
          return requests.success_response(req, res, user_list, "success request");
        }else{
          return requests.error_response(req, res, {}, "Wrong data");
        }
    },
}