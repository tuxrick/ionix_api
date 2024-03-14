'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

let user_functions = {

    log_user: async (user_info) => {
        try{
            let user_data = await user_functions.findUserByEmail(user_info.email);

            if (user_data !== false) {
                let token = await user_functions.generateTokenWithPassword(user_data, user_info.password);

                if (token === false) {
                    return false;
                }else{
                    return {token: token};
                }
            }else{
                return false;
            }
        }catch(err){
            return false;
        }
    },

    generateTokenWithPassword: async (user, password) => {

        console.log("user", user);

        let validate_pass = await bcrypt.compareSync(password, user.password);
        let token = ""; 


        if (validate_pass) {
            token = await jwt.sign(
                user.dataValues, 
                process.env.SECRET_KEY, {
                    expiresIn: 1440000
                }
            );
            return token;
        } else {
            return false;
        }
    },

    findUserByEmail: async (email) =>{
        try{
            let result = await User.findOne({
                where: {
                  email: email
                }
            }).then(user => {
                if (!user) return false;
                return user;
            });

            return result;
            
        }catch(err){
            return false;
        }
    },

    register_user: async (user_info) => {
        try{
            let user_data = await user_functions.findUserByEmail(user_info.email);
            console.log("user_data: ", user_data);
            //User already exists
            if (user_data !== false) {
                return false;
            }else{
                //New user
                user_info.password = bcrypt.hashSync(user_info.password, 10);

                let user = await User.create(user_info).then(user => {
                    if (!user) return false;
                    return user;
                });

                return user;
            }
        }catch(err){
            return false;
        }
    },

    list_users: async ()=>{
        try{
            let result = await User.findAll({
                attributes: ['id', 'email', 'name', 'last_name']
              }).then(users => {
                if (!users) return false;
                return users.map(user => user.toJSON());
              });

            return result;

        }catch(err){
            return false;
        }
    }
}

module.exports = user_functions;