
import { object, string } from "joi";
import mongoose, { Document, Schema, Types } from "mongoose";
import { buffer } from "stream/consumers";

//using enum for categories
// enum CategoryEnum{
//   ELECTRONICS = "Electronics",
//   DAILYUSE="dailyuse",
// }
export interface IProduct extends Document {
  name: string;
  description: string;
  price: mongoose.Schema.Types.Decimal128;
  isActive: boolean;
  quantity: number;
  // category: CategoryEnum;
  category:mongoose.Schema.Types.ObjectId;
  image?:string[];//for disk storage
  bufferImage?:Buffer; //for memoryStorage
  manufacturingAddress: [IManufacturingAddress]; 
}
export interface IManufacturingAddress{
  street: string;
  city: string;
  state: string;
  pincode: number;
}
const ManufacturingAddressSchema:Schema<IManufacturingAddress>=new Schema({
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  pincode: { type: Number, required: false },
})
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Types.Decimal128, required: true },
    isActive: { type: Boolean, required: true },
    quantity: { type: Number, required: true },
    // category: {
    //   type: String,
    //   enum: Object.values(CategoryEnum),
    //   required: true,
    // },
    category:{
      type:mongoose.Schema.Types.ObjectId,ref:"Category"
    },
    image:{type:String,required:false},
    // bufferImage:{type:buffer,required:false},
    manufacturingAddress: [{ type: ManufacturingAddressSchema, required: false }],

  },
  { timestamps: true }
);
const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
