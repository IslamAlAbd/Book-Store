import Log from "../decorators/logger";
import MeasureTime from "../decorators/MeasureTime";
import NotifyLowStock from "../decorators/NotifyLowStock";
import Retry from "../decorators/Retry";
import Validate from "../decorators/Validate";
import BookModel from "../models/bookModel";
import CustomerModel from "../models/customerModel";
import TransactionModel from "../models/transactionsModel";

interface BorrowData {
  bookId: string;
  name: string;
  phone: string;
  address: string;
  returnDueDate: Date;
  lateFeePerDay: number;
}

export class TransactionService {
  // private checkLowStock(availableCopies: number, minCopies: number) {
  //   if (availableCopies <= minCopies) {
  //     return `Low stock warning: only ${availableCopies} copies left`;
  //   }
  //   return null;
  // }
   @Log
   @NotifyLowStock
   @Validate('bookId','name', 'phone', 'address', 'amountPaid')
  async purchaseBook(transactionData: any) {
    try {
      const book = await BookModel.findById(transactionData.bookId);
      if (!book) return { success: false, error: "Book not found" };

      if (book.availableCopies <= 0)
        return { success: false, error: "No copies available for purchase" };

      const customer = await CustomerModel.create({
        name: transactionData.name,
        phone: transactionData.phone,
        address: transactionData.address,
      });

      const transaction = await TransactionModel.create({
        customerId: customer._id,
        bookId: transactionData.bookId,
        type: "purchase",
        date: new Date(),
        purchaseDetails: {
          amountPaid: transactionData.amountPaid,
        },
      });

      // const updatedBook = await BookModel.findByIdAndUpdate(
      //   transactionData.bookId,
      //   { $inc: { availableCopies: -1 } },
      //   { new: true },
      // );
      // const notification = this.checkLowStock(
      //   updatedBook!.availableCopies,
      //   updatedBook!.minCopies,
      // );
      return { success: true, data: { customer, transaction, 
       // notification
       } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
   @NotifyLowStock
   @Validate('bookId','name', 'phone', 'address', 'returnDueDate','lateFeePerDay')
  async borrowBook(transactionData: BorrowData) {
    try {
      // Validate book exists
      const book = await BookModel.findById(transactionData.bookId);
      if (!book) return { success: false, error: "Book not found" };

      // Check availableCopies >= minCopies
      if (book.availableCopies < book.minCopies)
        return {
          success: false,
          error: `Cannot borrow: copies below minimum (${book.minCopies})`,
        };

      // Create customer
      const customer = await CustomerModel.create({
        name: transactionData.name,
        phone: transactionData.phone,
        address: transactionData.address,
      });

      // Create transaction
      const transaction = await TransactionModel.create({
        customerId: customer._id,
        bookId: transactionData.bookId,
        type: "borrow",
        date: new Date(),
        borrowDetails: {
          returnDueDate: transactionData.returnDueDate,
          returnedDate: null,
          lateFeePerDay: transactionData.lateFeePerDay,
          lateFeeCharged: 0,
          isReturned: false,
        },
      });

      // Deduct availableCopies
      // const updatedBook = await BookModel.findByIdAndUpdate(
      //   transactionData.bookId,
      //   { $inc: { availableCopies: -1 } },
      //   { new: true },
      // );

      // Check low stock
      // const notification = this.checkLowStock(
      //   updatedBook!.availableCopies,
      //   updatedBook!.minCopies,
      // );

      return { success: true, data: { customer, transaction,
        //  notification 
        } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  @Log
  async returnBook(id: string) {
    try {
      const transaction = await TransactionModel.findById(id);
      if (!transaction)
        return { success: false, error: "Transaction not found" };

      if (transaction.type !== "borrow")
        return { success: false, error: "This transaction is not a borrow" };

      if (transaction.borrowDetails?.isReturned)
        return { success: false, error: "Book already returned" };

      const today = new Date();
      const returnDueDate = transaction.borrowDetails!.returnDueDate;
      const lateFeePerDay = transaction.borrowDetails!.lateFeePerDay;
      let lateFeeCharged = 0;

      if (today > returnDueDate!) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysLate = Math.ceil(
          (today.getTime() - returnDueDate!.getTime()) / msPerDay,
        );
        lateFeeCharged = daysLate * lateFeePerDay!;
      }

      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        id,
        {
          "borrowDetails.isReturned": true,
          "borrowDetails.returnedDate": today,
          "borrowDetails.lateFeeCharged": lateFeeCharged,
        },
        { new: true },
      );

      await BookModel.findByIdAndUpdate(transaction.bookId, {
        $inc: { availableCopies: +1 },
      });

      return {
        success: true,
        data: {
          transaction: updatedTransaction,
          lateFeeCharged,
          message:
            lateFeeCharged > 0
              ? `Book returned late. Fee charged: $${lateFeeCharged}`
              : "Book returned on time",
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  @MeasureTime
  @Retry()
  async getAllTransactions() {
    try {
      const transactions = await TransactionModel.find()
        .populate("bookId", "title author ISBN")
        .populate("customerId", "name phone");
      return { success: true, data: transactions };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async getTransactionById(id: string) {
    try {
      const transaction = await TransactionModel.findById(id)
        .populate("bookId", "title author ISBN")
        .populate("customerId", "name phone");
      if (!transaction)
        return { success: false, error: "Transaction not found" };
      return { success: true, data: transaction };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }
}
