// These create standardized response object for the success or error with a structured status code and body. Check userController.js and expenseController.js
const success = (code,body)=>{
    return {
        status : "success",
        statusCode : code,
        message : body
    }
}
const error = (code,body)=>{
    return {
        status : "error",
        statusCode : code,
        message : body
    }
}
module.exports = {
    success , error
}