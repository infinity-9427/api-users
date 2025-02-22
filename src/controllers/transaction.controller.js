import { PrismaClient } from '@prisma/client';
import Joi from "joi";

const prisma = new PrismaClient({
  __internal: {
    engine: {
      statement_cache_size: 0,
    },
  },
});

const transactionSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    'any.required': 'User ID is required',
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
  }),
  type: Joi.string().valid("deposit", "withdrawal").required().messages({
    'any.required': 'Transaction type is required',
    'any.only': 'Transaction type must be either deposit or withdrawal',
  }),
});

export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type } = req.body;

    // Validate input fields
    const { error } = transactionSchema.validate({ userId, amount, type });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { transactions: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate current balance
    const balance = user.transactions.reduce(
      (acc, t) => (t.type === "deposit" ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount)),
      0
    );

    // Check for sufficient balance
    if (type === "withdrawal" && balance < amount) {
      return res.status(400).json({ error: "Insufficient balance for withdrawal" });
    }

    // Create the transaction
    const newTransaction = await prisma.transaction.create({
      data: { userId, amount, type },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTransactionsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || isNaN(parseInt(user_id))) {
      return res.status(400).json({ error: "Invalid or missing user ID in request parameters" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
      include: { transactions: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
