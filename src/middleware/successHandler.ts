import { Response } from "express";

export interface SuccessResponse{
    status:number;
    success:boolean;
    message:string;
    data?:any;
}

export const successHanlder=(res:Response,message:string,data?:any,status:number=200)=>{
res.status(status).json({status,success:true,message,data,}as SuccessResponse);
};