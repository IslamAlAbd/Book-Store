import { Request, Response } from "express";
import { BookService } from "../services/bookSerrvices";
import { BookCategory, BookContentType } from "../models/bookModel";

const bookService = new BookService();

export class BookController {
  async getAllBooks(req: Request, res: Response) {
    const result = await bookService.getAllBooks();
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async getBookById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await bookService.getBookById(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async addBook(req: Request, res: Response) {
    const result = await bookService.addBook(req.body);
    if (!result.success) return res.status(400).json(result);
    return res.status(201).json(result);
  }

  async updateBook(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await bookService.updateBook(id, req.body);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async deleteBook(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await bookService.deleteBook(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async searchBooks(req: Request, res: Response) {
    const { key } = req.query as { key?: string };
    if (!key)
      return res
        .status(400)
        .json({ success: false, error: "Missing search key" });
    const result = await bookService.search(key);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }

  async filterBooks(req: Request, res: Response) {
  const { contentType, category } = req.query;

  // ✅ Validate and cast
  const result = await bookService.filter(
    contentType as BookContentType | undefined,
    category   as BookCategory    | undefined
  );

  if (!result.success)
    return res.status(404).json(result);
  return res.status(200).json(result);
}
}
