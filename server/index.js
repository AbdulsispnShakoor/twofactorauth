import express from 'express';
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";








app.all("*", (req, res,next) =>{
   const err = new CustomeError("Can't find : " + req.originalUrl , 404)
    next(err);
})

app.use(globalErrorHandler)