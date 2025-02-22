import { PrismaClient } from '@prisma/client';
import Joi from "joi";
import { uploadImage, deleteImage } from "../helpers/imageFormatter.js";

const prisma = new PrismaClient({
  __internal: {
    engine: {
      statement_cache_size: 0,
    },
  },
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
});

export const createUser = async (req, res) => {
  try {
    console.log(req.body, 'body create');

    const { name, email } = req.body;
    const file = req.files?.avatar;

    const { error } = userSchema.validate({ name, email });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (userExist) return res.status(400).json({ error: "Email already in use" });

    if (!file) return res.status(400).json({ error: "Avatar is required" });

    const uploadedImage = await uploadImage(file, "users_folder");
    const avatar = {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
    };

    const newUser = await prisma.user.create({
      data: { name, email, avatar },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log(user, 'user delete');

    if (user.avatar?.public_id) {
      await deleteImage(user.avatar.public_id);
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};