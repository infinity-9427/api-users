import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUser);
