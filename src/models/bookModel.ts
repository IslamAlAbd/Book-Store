import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: null },
    ISBN: { type: String, required: true, unique: true },
    author: { type: String, required: true }, 
    contentType: {
      type: String,
      enum: ["scientific", "literary", "historical", "educational"],
    },
    category: {
      type: String,
      enum: ["novel", "biography", "physics", "mathematics"],
    }, 
    totalCopies: { type: Number, required: true }, 
    availableCopies: { type: Number, required: true },
    salePrice: { type: Number, required: true }, 
    borrowPrice: { type: Number, required: true }, 
    minCopies: { type: Number, default: 3 },
  },
  { timestamps: true },
);
export type BookContentType = "scientific" | "literary" | "historical" | "educational";
export type BookCategory = "novel" | "biography" | "physics" | "mathematics";
const BookModel = model("Book", bookSchema);
export default BookModel;
