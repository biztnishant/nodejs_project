import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import EmailLayoutModel from "../models/emailLayout";
import { BlockModel, BlockType, BlockProps, BlockStyle } from "../models/blockSchema"
import { AppError } from "../middleware/errorhandler";

interface CreateEmailLayoutRequestBody {
    backdropColor: string;
    canvasColor: string;
    textColor: string;
    fontFamily: string;
    initialBgColor?: string;
    children: Array<{
        type: BlockType; // Enum type for block
        props: BlockProps;
        style: BlockStyle;
    }>;
}
export const createEmailLayout = async (
    req: Request,  
    res: Response,
    next: NextFunction
) => {
    try {  
        const { backdropColor, canvasColor, textColor, fontFamily, initialBgColor, children } = (req as any).body as CreateEmailLayoutRequestBody;
        const blockIds: mongoose.Schema.Types.ObjectId[] = [];
        // Process each block and save it
        for (const block of children) {
            const newBlock = new BlockModel({
                type: block.type,
                data: {
                    props: block.props,
                    style: block.style,
                },
            });
            const savedBlock = await newBlock.save();
            blockIds.push(savedBlock._id as mongoose.Schema.Types.ObjectId);
        }
        // create the emailLayout with the block references
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
        res.status(201).json({
            success: true,
            emailLayout: savedEmailLayout,
        });
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
            throw new AppError("Not found emailLayouts",400);
        }
        return res.status(200).json({
            success: true,
            emailLayouts,
        });
    } catch (error) {
        console.error("Error fetching email layouts:", error); //for testing purpose
        next(error);
    }
};