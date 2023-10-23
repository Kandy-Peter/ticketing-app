import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof CustomError){
    return res.status(err.statusCode).send({
      status: err.statusCode,
      errors: err.serializeErrors()
    })
  }

  res.status(400).send({
    status: res.statusCode,
    errors: [{ message: err.message || 'Something went wrong' }]
  }); 
}
