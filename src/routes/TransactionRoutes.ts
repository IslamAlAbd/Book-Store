import { Router } from "express";
import { TransactionController } from "../controllers/TransactionsController";

const router = Router();
const transactionController = new TransactionController();

router.get("/", (req, res) =>
  transactionController.getAllTransactions(req, res),
);
router.get("/:id", (req, res) =>
  transactionController.getTransactionById(req, res),
);
router.post("/purchase", (req, res) =>
  transactionController.purchaseBook(req, res),
);
router.post("/borrow", (req, res) =>
  transactionController.borrowBook(req, res),
);
router.put("/return/:id", (req, res) =>
  transactionController.returnBook(req, res),
);

export default router;
