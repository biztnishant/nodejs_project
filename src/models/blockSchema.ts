import mongoose,{Document, model, Schema} from "mongoose";

export enum BlockType {
    TEXT = "Text",
    IMAGE = "Image",
    BUTTON = "Button",
    GRID = "Grid",
    EMPTY = "Empty",
}
interface BlockStyle {
    [key: string]: any;  // any property can be passed here depending on the block type
}
interface BlockProps {
    text?: string;   
    url?: string;    
    alt?: string;    
    backgroundImage?: string; 
    // add more specific fields depending on the block type (if needed)
}
interface Block extends Document {
    type: BlockType;  // use the BlockType enum
    data: {
        props: BlockProps;  
        style: BlockStyle; 
    };
}
const blockSchema = new Schema<Block>({
    type: {
        type: String,
        enum: Object.values(BlockType), // Enforce BlockType enum values
        required: true
    },
    data: {
        props: {
            type: Schema.Types.Mixed, // Allow flexibility in props for different block types
            required: true
        },
        style: {
            type: Schema.Types.Mixed, // Allow flexibility in style for different block types
            required: true
        },
    },
});
const BlockModel = model<Block>('Block', blockSchema);
export { BlockProps, BlockStyle, BlockModel }