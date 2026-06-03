import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/BookRoutes";
import customerRoutes from "./routes/CustomerRoutes";
import transactionRoutes from "./routes/TransactionRoutes";
import stockRoutes from "./routes/StockPurchaseRoutes";
import connectDB from "./config/db";

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stock", stockRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

