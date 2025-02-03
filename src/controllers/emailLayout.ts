import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import EmailLayoutModel from "../models/emailLayout";
import { BlockModel, BlockType, BlockProps, BlockStyle } from "../models/blockSchema"
import { AppError } from "../middleware/errorhandler";
import { successHanlder } from "../middleware/successHandler";
// interface CreateEmailLayoutRequestBody {
//     backdropColor: string;
//     canvasColor: string;
//     textColor: string;
//     fontFamily: string;
//     initialBgColor?: string;
//     children: Array<{
//         type: BlockType; // Enum type for block
//         props: BlockProps;
//         style: BlockStyle;
//     }>;
// }
// export const createEmailLayout = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { backdropColor, canvasColor, textColor, fontFamily, initialBgColor, children } = (req as any).body as CreateEmailLayoutRequestBody;//this is type assertion with object
//         const blockIds: mongoose.Schema.Types.ObjectId[] = [];
//         // Process each block and save it
//         for (const block of children) {
//             const newBlock = new BlockModel({
//                 type: block.type,
//                 data: {
//                     props: block.props,
//                     style: block.style,
//                 },
//             });
//             const savedBlock = await newBlock.save();
//             blockIds.push(savedBlock._id as mongoose.Schema.Types.ObjectId);
//         }
//         // create the emailLayout with the block references
//         const newEmailLayout = new EmailLayoutModel({
//             backdropColor,
//             canvasColor,
//             textColor,
//             fontFamily,
//             initialBgColor,
//             childrenIds: blockIds,
//         });
//         // save the EmailLayout to the database
//         const savedEmailLayout = await newEmailLayout.save();
//         // res.status(201).json({
//         //     success: true,
//         //     emailLayout: savedEmailLayout,
//         // });
//         successHanlder(res, "Successfully created emailLayout", savedEmailLayout);
//     } catch (error: any) {
//         console.error(error);
//         next(error);
//     }
//  };
export const createEmailLayout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestData = (req as any).body;
        // Extract the root object (Email Layout)
        const root = requestData.root;
        if (!root) {
            throw new AppError("Invalid request data: Missing root.",400);
        }
        const { backdropColor, canvasColor, textColor, fontFamily, childrenIds, initialBgColor } = root.data;
        // convert blocks to an array
        const blockIds: mongoose.Schema.Types.ObjectId[] = [];
        for (const blockId of childrenIds) {
            if (requestData[blockId]) { // Ensure block exists in JSON
                const block = requestData[blockId];

                // Create and save the block
                const newBlock = new BlockModel({
                    type: block.type,
                    data: {
                        props: block.data.props,
                        style: block.data.style,
                    },
                });

                const savedBlock = await newBlock.save();
                blockIds.push(savedBlock._id as mongoose.Schema.Types.ObjectId);
            }
        }

        // create the EmailLayout with stored block references
        const newEmailLayout = new EmailLayoutModel({
            backdropColor,
            canvasColor,
            textColor,
            fontFamily,
            initialBgColor,
            childrenIds: blockIds,
        });

        // save the EmailLayout to the database
        const savedEmailLayout = await newEmailLayout.save();

        successHanlder(res, "Successfully created emailLayout", savedEmailLayout);
    } catch (error: any) {
        console.error(error);
        next(error);
    }
};

// export const createEmailLayout = async (
//     req: Request<{}, {}, CreateEmailLayoutRequestBody>,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { backdropColor, canvasColor, textColor, fontFamily, initialBgColor, children } = req.body;
//         // Map and save blocks concurrently
//         const blockPromises = children.map(async (block) => {
//             const newBlock = new BlockModel({
//                 type: block.type,
//                 data: {
//                     props: block.props,
//                     style: block.style,
//                 },
//             });
//             return await newBlock.save();
//         });

//         // Wait for all blocks to be saved and extract their IDs
//         const savedBlocks = await Promise.all(blockPromises);
//         const blockIds = savedBlocks.map((block) => block._id as mongoose.Schema.Types.ObjectId);

//         // Create and save the email layout
//         const newEmailLayout = new EmailLayoutModel({
//             backdropColor,
//             canvasColor,
//             textColor,
//             fontFamily,
//             initialBgColor,
//             childrenIds: blockIds,
//         });
//         const savedEmailLayout = await newEmailLayout.save();
//         // Respond with the saved email layout
//         return res.status(201).json({
//             success: true,
//             emailLayout: savedEmailLayout,
//         });
//     } catch (error) {
//         console.error("Error creating email layout:", error);
//         next(error);
//     }
// };
export const getEmailLayouts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Find all email layouts
        const emailLayouts = await EmailLayoutModel.find()
            .populate({
                path: "childrenIds", // Populate the childrenIds field with block data
                model: BlockModel,
            })
            .exec();
        if (!emailLayouts || emailLayouts.length === 0) {
            throw new AppError("No emailLayouts",400);
        }
        // return res.status(200).json({
        //     success: true,
        //     emailLayouts,
        // });
        successHanlder(res,"Successfully fetched emailLayouts",emailLayouts);
    } catch (error) {
        console.error("Error fetching email layouts:", error); //for testing purpose
        next(error);
    }
};
export const deleteEmailLayout=async(req:Request,res:Response,next:NextFunction)=>{
   try{
       const { id } = req.params;
       const emailLayoutdelete = await EmailLayoutModel.findByIdAndDelete(id);
       if (!emailLayoutdelete) {
           throw new AppError("EmailLayout not found", 404);
       }
       successHanlder(res,"Deleted successfully",emailLayoutdelete);
   }catch(error){
    next(error);
   }

}