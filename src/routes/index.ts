import express from "express";
import authRouter from "./auth.route";
import { trainerRouter } from "./trainer.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/",trainerRouter)

export default router;
