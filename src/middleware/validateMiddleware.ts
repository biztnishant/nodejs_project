import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorhandler';
import Joi from 'joi';

export const validateProduct = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log("Validation Error Details:", error.details);
            const details = error.details.map((detail) => detail.message);
            return next(new AppError("Validation error", 400, details));
        }
        next(); 
    };
};
