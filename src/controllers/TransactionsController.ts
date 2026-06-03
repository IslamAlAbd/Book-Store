import { Request, Response } from "express";
import { TransactionService } from "../services/TransactionService";

const transactions = new TransactionService();

export class TransactionController {

  async purchaseBook(req: Request, res: Response) {
    const { bookId, name, phone, address, amountPaid } = req.body;

    if (!bookId || !name || !phone || !address || !amountPaid)
      return res.status(400).json({
        success: false,
        error: "bookId, name, phone, address and amountPaid are required",
      });

    const result = await transactions.purchaseBook(req.body);

    if (!result.success) return res.status(400).json(result);

    return res.status(201).json(result);
  }

  async borrowBook(req: Request, res: Response) {
    const { bookId, name, phone, address, returnDueDate, lateFeePerDay } = req.body;
    if (!bookId || !name || !phone || !address || !returnDueDate || !lateFeePerDay)
      return res.status(400).json({
        success: false,
        error: "bookId, name, phone, address, returnDueDate and lateFeePerDay are required",
      });

    const result = await transactions.purchaseBook(req.body);

    if (!result.success) return res.status(400).json(result);

    return res.status(201).json(result);
  }

  async returnBook(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });

    const result = await transactions.returnBook(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async getAllTransactions(req: Request, res: Response) {
    const result = await transactions.getAllTransactions();
    if (!result.success)
      return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async getTransactionById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "Transaction ID is required" });
    const result = await transactions.getTransactionById(id);
    if (!result.success)
      return res.status(404).json(result);
    return res.status(200).json(result);
  }
}
