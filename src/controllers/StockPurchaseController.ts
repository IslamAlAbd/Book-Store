import { Request, Response } from "express";
import { StockPurchaseService } from "../services/StockPurchaseService";

const stockPurchase = new StockPurchaseService();

export class StockPurchaseController {
  async restockBook(req: Request, res: Response) {
    const { bookId, copiesAdded } = req.body;

    if (!bookId || !copiesAdded)
      return res.status(400).json({
        success: false,
        error: "bookId and copiesAdded are required",
      });

    const result = await stockPurchase.restockBook(req.body);

    if (!result.success) return res.status(400).json(result);

    return res.status(201).json(result);
  }
  async getRestockHistory(req: Request, res: Response) {
    const result = await stockPurchase.getRestockHistory();
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
  async getRestockById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await stockPurchase.getRestockById(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
}
