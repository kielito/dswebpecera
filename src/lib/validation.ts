import {Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';
import flash from "connect-flash";

export function validateRequestSchema(req: Request, res:Response, next:NextFunction) {
    const result = validationResult(req);
    console.log(result);

    if(!result.isEmpty()){       
        //return res.status(400).json({errores: result.array()[0].msg});
        //req.flash('error',result.array()[0].msg);
        for (let i=0;i<result.array().length;i++) {
            req.flash('error',result.array()[i].msg);
        }
		return res.redirect("./signup");
    }
    next();
}