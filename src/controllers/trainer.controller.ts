import { Request, Response } from "express";
import { HttpResponse } from "../classes/HttpResponse";
import { TrainerSchema } from "../models/trainerModal";

export async function getTrainersByLocation(req: Request, res: Response) {
  try {
    const lat = String(req.query.lat);
    const lng = String(req.query.lng);

    if (!lat || !lng) {
      return new HttpResponse(res, "Invalid location", null, 400).sendResponse();
    }

    const trainers = await TrainerSchema.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [ parseFloat(lat),parseFloat(lng)],
          },
          $maxDistance: 50000, // Maximum distance in meters (adjust as needed)
        },
      },
    });

    if (trainers.length === 0) {
      return new HttpResponse(res, "No trainer nearby", null, 404).sendResponse();
    }

    return new HttpResponse(res, "Get trainer by location", trainers, 200).sendResponse();
  } catch (error: any) {
    return new HttpResponse(res).sendErrorResponse(error);
  }
}

export async function addTrainers(req: Request, res: Response) {
  try {
    const trainersData = req.body;

    if (!Array.isArray(trainersData)) {
      return new HttpResponse(res, "Invalid data format", null, 400).sendResponse();
    }

    const newTrainers = await TrainerSchema.insertMany(trainersData);
    
    return new HttpResponse(res,"Add trainers", newTrainers, 201).sendResponse();
  } catch (error: any) {
    return new HttpResponse(res).sendErrorResponse(error);
  }
}
