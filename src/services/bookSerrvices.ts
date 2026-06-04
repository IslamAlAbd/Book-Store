import Log from "../decorators/logger";
import MeasureTime from "../decorators/MeasureTime";
import Retry from "../decorators/Retry";
import Validate from "../decorators/Validate";
import BookModel, { BookCategory, BookContentType } from "../models/bookModel";

interface BookData {
  title?: string;
  ISBN?: string;
  author?: string;
  contentType?: BookContentType;
  category?: BookCategory;
  totalCopies?: number;
  availableCopies?: number;
  salePrice?: number;
  borrowPrice?: number;
  minCopies?: number;
  image?: string;
}

export class BookService {

  @Log
  @MeasureTime
  @Retry(3)
  async getAllBooks() {
    try {
      const books = await BookModel.find();
      return { success: true, data: books };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
  async getBookById(id: string) {
    try {
      const book = await BookModel.findById(id);
      if (!book) return { success: false, error: "Book not found" };
      return { success: true, data: book };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
   @Validate('title', 'ISBN', 'author', 'salePrice')
  async addBook(bookData: BookData) {
    try {
      const newBook = await BookModel.create(bookData);
      return { success: true, data: newBook };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
  async updateBook(id: string, bookData: BookData) {
    try {
      const book = await BookModel.findById(id);
      if (!book) return { success: false, error: "Book not found" };

      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        bookData,
        { new: true }
      );
      return { success: true, data: updatedBook };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
  async deleteBook(id: string) {
    try {
      const book = await BookModel.findById(id);
      if (!book) return { success: false, error: "Book not found" };

      await BookModel.findByIdAndDelete(id);
      return { success: true, data: { message: "Book deleted successfully" } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

   @Log
   @MeasureTime
  async search(key: string) {
    try {
      const books = await BookModel.find({
        $or: [
          { title:  { $regex: key, $options: "i" } },  
          { ISBN:   { $regex: key, $options: "i" } },
          { author: { $regex: key, $options: "i" } },
        ],
      });

      if (books.length === 0)
        return { success: false, error: "No books found" };

      return { success: true, data: books };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async filter(contentType?: BookContentType, category?: BookCategory) {
    try {
      const query: any = {};

      if (contentType) query.contentType = contentType;
      if (category)    query.category    = category;

      if (Object.keys(query).length === 0)
        return { success: false, error: "Provide at least one filter" };

      const books = await BookModel.find(query);

      if (books.length === 0)
        return { success: false, error: "No books found" };

      return { success: true, data: books };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }
}