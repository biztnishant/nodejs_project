import mongoose, { Schema } from "mongoose";

export interface ICategories{
    name:string;
    description:string;
}
const categorySchema: Schema<ICategories> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
})
const CategoryModel=mongoose.model('Category',categorySchema);
export default CategoryModel;