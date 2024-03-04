import { CustomeError } from "../utils/customeError.js";


const devError = (error,res) =>{
    res.status(error.statusCode).json({
        status: error.status,
        message:error.message,
        stackTrace: error.stack,
        error: error
    });
};
const prodError = (error,res) =>{

    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.status,
            message:error.message
        })
    }else{
        res.status(500).json({
            status: "Internal Server Error",
            message:"something went wrong! Please try again later."
        })
    }
};

const castError = (err) =>{
    const msg = `Invalid value for ${err.path} : ${err.value}`;
    return new CustomeError(msg, 400)
};

const duplicateKeyError = (err) =>{
    // console.log(err)
    const msg = `The Book with the given name : ${err?.keyValue?.title} is already available! Please Change your book name.`;
    return new CustomeError(msg, 400)
};

const handleTokenExpiredError = (err) =>{
    // console.log(err)
    const msg = `JWT has been expired! Please login again.`;
    return new CustomeError(msg, 401)
};
const handleJsonWebTokenError = (err) =>{
    const msg = `Invalid token! Please login again.`;
    return new CustomeError(msg, 401)
};

const ValidationError = (err) =>{
   const errors = Object.values(err.errors).map(val => val.message);
    const errorsMessage = errors.join(', ');
    const msg = `Invalide input data: ${errorsMessage}`;
    return new CustomeError(msg, 400)
};

export const globalErrorHandler = (error, req, res, next) =>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if(process.env.NODE_ENV === "development"){

        devError(error,res);

    }else if(process.env.NODE_ENV === "production"){
       
        if(error.name === "CastError"){
           error = castError(error)
        }
        if(error.name === "ValidationError"){
           error = ValidationError(error)
        }
        if(error.code === 11000){
           error = duplicateKeyError(error)
        }
        if(error.name === "TokenExpiredError"){
           error = handleTokenExpiredError(error)
        }
        if(error.name === "JsonWebTokenError"){
           error = handleJsonWebTokenError(error)
        }
        prodError(error,res);
    }

}