
import { AppError } from "../middleware/errorhandler";
import CategoryModel from "../models/category";
import { Request, Response,NextFunction } from "express";
import { successHanlder } from "../middleware/successHandler";

export const createCategory=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const categoryData=await CategoryModel.create(req.body);
        // res.status(201).json({ message: "Product created successfully", data: categoryData });
        successHanlder(res,"Created category successfully",categoryData,201);
    } catch (error: any) {
        // res.status(400).json({ message: "Error creating product", error: error.message });
        // if(error instanceof AppError){
        //     next(error);
        // }else{
        //     next(new AppError("unexpected error",500));
        // }
       next(error);
    }
};
export const getCategories=async(req:Request,res:Response ,next:NextFunction)=>{
    try{
        const categories=await CategoryModel.find();
        if(!categories){
            throw new AppError("No categories found",404);
        }
        // res.status(200).json({ message: "Successfully fetched categories", categories });
        successHanlder(res,"Successfully fetched categories",categories);
    } catch(error:any) {
        // res.status(404).json({ message: error.message });
        // if(error instanceof AppError){
        //     next(error);
        // }else{
        //     next(new AppError("Unexpected error",500));
        // }
        next(error);
    }
};
export const getCategorybyId=async (req:Request,res:Response,next:NextFunction)=>{
   try{
       const { id } = req.params;
       const categories = await CategoryModel.findById(id);
       if(!categories){
        throw new AppError("Categories not found",404);
       }
    //    res.status(200).json({message:"Successfully fetched category",data:categories});
       successHanlder(res,"Successfully fetched category",categories);
   }catch(error:any){
   next(error);
   }
};
export const deleteCategoryById=async(req:Request,res:Response,next:NextFunction)=>{
   try{
       const CategoryId= req.params.id;
    //    console.log("id",CategoryId);
       const categoryDeleted = await CategoryModel.findByIdAndDelete(CategoryId);
       if (!categoryDeleted) {
           throw new AppError("Category not found",404);
       }
       successHanlder(res,"Category deleted successfully",categoryDeleted);
   }catch(error){
    next(error);
   }
};