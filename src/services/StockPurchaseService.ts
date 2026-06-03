import BookModel from "../models/bookModel";
import StockPurchaseModel from "../models/StockPurchase";

interface StockPurchaseData {
  bookId: string;
  copiesAdded: number;
  date: Date;
  notes?: string;
}

export class StockPurchaseService {
  async restockBook(stockPurchase: StockPurchaseData) {
    try {
      const book = await BookModel.findById(stockPurchase.bookId);
      if (!book) return { success: false, error: "Book not found" };
      const updatedBook = await BookModel.findByIdAndUpdate(
        stockPurchase.bookId,
        {
          $inc: {
            availableCopies: stockPurchase.copiesAdded,
            totalCopies: stockPurchase.copiesAdded,
          },
        },
        { new: true },
      );

      const restockRecord = await StockPurchaseModel.create({
        bookId: stockPurchase.bookId,
        copiesAdded: stockPurchase.copiesAdded,
        date: new Date(),
        notes: stockPurchase.notes || "",
      });
      return { success: true, data: { updatedBook, restockRecord } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async getRestockHistory() {
    try {
      const restockHistory = await StockPurchaseModel.find().populate(
        "bookId",
        "title author ISBN availableCopies totalCopies",
      );
      return { success: true, data: restockHistory };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async getRestockById(id: string) {
    try {
      const restock = await StockPurchaseModel.findById(id).populate(
        "bookId",
        "title author ISBN availableCopies totalCopies",
      );
      if (!restock)
        return { success: false, error: "Restock record not found" };
      return { success: true, data: restock };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }
}
