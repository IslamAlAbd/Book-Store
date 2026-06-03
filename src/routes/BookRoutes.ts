import { Router } from "express";
import { BookController } from "../controllers/BookController";

const router = Router();
const bookController = new BookController();

// Manager routes
router.post("/", (req, res) => bookController.addBook(req, res));
router.put("/:id", (req, res) => bookController.updateBook(req, res));
router.delete("/:id", (req, res) => bookController.deleteBook(req, res));

// Shared routes (manager + customer)
router.get("/", (req, res) => bookController.getAllBooks(req, res));
router.get("/search", (req, res) => bookController.searchBooks(req, res));
router.get("/filter", (req, res) => bookController.filterBooks(req, res));
router.get("/:id", (req, res) => bookController.getBookById(req, res));

export default router;
