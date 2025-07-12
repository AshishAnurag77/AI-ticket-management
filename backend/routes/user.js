import express from "express";
import { signup, login, getUsers, updateUser } from "../controllers/user.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", authenticate, authorize(["admin"]), getUsers);
router.post("/update-user", authenticate, authorize(["admin"]), updateUser);

export default router;