import { Router } from "express";
import {
  createTransaction,
  getTransactionsByUser,
} from "../controllers/transaction.controller.js";

export const transactionRouter = Router();

transactionRouter.post("/", createTransaction);
transactionRouter.get("/:user_id", getTransactionsByUser);
