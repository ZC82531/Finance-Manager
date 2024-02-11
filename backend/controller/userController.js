const userModel = require('../db/userModel')
const { error, success } = require('../utils/handler')

const loginController = async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password) {
           return res.send(error(400,"Email and password Required!!"));
            
        }
         user = await userModel.findOne({email , password});
        if(!user)
        {
           return res.send(error(401 , "User Not Found!! Please Sign Up"))
        }
        return res.send(success(201 , user));
    } catch (err) {
        return res.send(error(401,err.message));
    }
}

const signupContorller = async (req,res)=>{
    try {
        const {username , email , password } = req.body;
        if(!username || !email || !password)
        {
           return res.send(error(401 , "Enter Every Field!!!"));
        }
        // This is sending information to Mongoose if successful
        const newUser = await userModel.create({
            username , 
            email,
            password
        })
        
        return res.send(success(201 , "user is created"));
    } catch (err) {
       return res.send(error(401 , err.message));
    }
}

const logoutController = async (req, res) => {
    try {
        // If using sessions, destroy the session data on server side so the cookie stored becomes invalidated.
        req.session.destroy((err) => {
            if (err) {
                // If there was an error destroying the session, send an error response
                return res.send(error(500, "Could not log out, please try again."));
            }
            // Send success response if logout was successful
            return res.send(success(200, "User logged out successfully."));
        });
    } catch (err) {
        // Handle any other errors that may occur
        return res.send(error(401, err.message));
    }
};

module.exports = {
    loginController,
    logoutController,
    signupContorller
}