import express from "express";
import { addTrainers, getTrainersByLocation } from "../controllers/trainer.controller";

export const trainerRouter = express.Router();


trainerRouter.get("/trainers",getTrainersByLocation)
trainerRouter.post("/add-trainers",addTrainers)