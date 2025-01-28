import mongoose, { Schema, Document, model } from "mongoose";
interface EmailLayout extends Document {
    backdropColor: string;
    canvasColor: string;
    textColor: string;
    fontFamily: string;
    initialBgColor?: string;
    childrenIds: mongoose.Schema.Types.ObjectId[];  // References the IDs of the Block models
}
const emailLayoutSchema = new Schema<EmailLayout>({
    backdropColor: { type: String, required: true },
    canvasColor: { type: String, required: true },
    textColor: { type: String, required: true },
    fontFamily: { type: String, required: true },
    initialBgColor: { type: String },
    childrenIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Block", // Reference to Block collection
        required: true,
    }, // Array of Block IDs
});
const EmailLayoutModel = model<EmailLayout>("EmailLayout",emailLayoutSchema);
export default EmailLayoutModel;
