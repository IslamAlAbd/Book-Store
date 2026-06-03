import { Schema, model } from "mongoose";

const stockPurchaseSchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    copiesAdded: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

const StockPurchaseModel = model("StockPurchase", stockPurchaseSchema);
export default StockPurchaseModel;
