const jwt = require('jsonwebtoken');
const requests = require('../utils/requests');

// middleware to validate token
module.exports = {

    verifyToken: async (req, res, next) => {

        let token =req.body.token;

        if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1];// Bearer <token>
        }

        let result;
        if (token) {
            const options = {
                expiresIn: '90d',
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, process.env.SECRET_KEY, options);
                
                req.decoded = result;
                req.token = token;
                // We call next to pass execution to the subsequent middleware
                next(); 

            } catch (err) {
                return requests.success_response(req, res, {}, "Token not found", "error" );      
            }
        } else {
            return requests.error_response(req, res, {}, "Token not found", "error" );      
        }    

    },
}