import { Router } from "express";
import { StockPurchaseController } from "../controllers/StockPurchaseController";

const router = Router();
const stockPurchaseController = new StockPurchaseController();

router.get("/", (req, res) =>
  stockPurchaseController.getRestockHistory(req, res),
);
router.get("/:id", (req, res) =>
  stockPurchaseController.getRestockById(req, res),
);
router.post("/", (req, res) => stockPurchaseController.restockBook(req, res));

export default router;
