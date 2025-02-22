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
  userId: Joi.number().integer().required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("deposit", "withdrawal").required(),
});

export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type } = req.body;

    const { error } = transactionSchema.validate({ userId, amount, type });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { transactions: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const balance = user.transactions.reduce(
      (acc, t) => (t.type === "deposit" ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount)),
      0
    );

    if (type === "withdrawal" && balance < amount) {
      return res.status(400).json({ error: "Insufficient balance for withdrawal" });
    }

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
