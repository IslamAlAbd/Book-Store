import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    type: { type: String, required: true, enum: ["purchase", "borrow"] },
    date: { type: Date, default: Date.now },
    purchaseDetails: {
      amountPaid: { type: Number },
    },
    borrowDetails: {
      returnDueDate: { type: Date },
      returnedDate: { type: Date, default: null },
      lateFeePerDay: { type: Number },
      lateFeeCharged: { type: Number, default: 0 },
      isReturned: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

const TransactionModel = model("Transaction", transactionSchema);
export default TransactionModel;
