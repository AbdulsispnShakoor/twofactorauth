


export class CustomeError extends Error {
    // here the cunstructure takes two properties 1. message and 2.statusCode

    constructor(message,statusCode){
        // like new Error("takes some string arguments")
        // the super(takes message)
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >=400 && statusCode <= 500 ? "failed" :"error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
};