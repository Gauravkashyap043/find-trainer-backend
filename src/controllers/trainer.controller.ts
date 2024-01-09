import { Request, Response } from "express";
import { HttpResponse } from "../classes/HttpResponse";
import { TrainerSchema } from "../models/trainerModal";

interface Location {
  coordinates: number[];
}

interface Trainer {
  name: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  specialization: string;
  rating: number;
  location: {
    type: string;
    coordinates: number[];
  };
}

function generateRandomTrainers(location: Location): Trainer[] {
  console.log("location----------->", location);
  const trainers: Trainer[] = [];
  const [fixedIntegerPart, fixedDecimalPart] = location.coordinates.map((coord) => {
    const integerPart = Math.floor(coord);
    const decimalPart = Math.random().toFixed(4).substring(2);
    return [integerPart, decimalPart];
  });

  for (let i = 0; i < 30; i++) {
    const roundedCoordinates = fixedDecimalPart.map((decimalPart) => {
      return Number(`${fixedIntegerPart}.${decimalPart}`);
    });

    const trainer: Trainer = {
      name: `Trainer ${String.fromCharCode(65 + i)}`,
      phoneNumber: "123-456-7890",
      imageUrl: `https://example.com/trainer${String.fromCharCode(65 + i)}.jpg`,
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      specialization: "General Fitness",
      rating: Math.floor(Math.random() * (5 - 3 + 1) + 3),
      location: {
        type: "Point",
        coordinates: roundedCoordinates,
      },
    };
    trainers.push(trainer);
  }
  return trainers;
}

export async function getTrainersByLocation(req: Request, res: Response) {
  try {
    const lat = String(req.query.lat);
    const lng = String(req.query.lng);
    const radius = req.query.radius
      ? parseFloat(req.query.radius as string)
      : 100;

    if (!lat || !lng) {
      return new HttpResponse(
        res,
        "Invalid location",
        null,
        400
      ).sendResponse();
    }

    const trainers = await TrainerSchema.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lat), parseFloat(lng)],
          },
          $maxDistance: radius * 1000,
        },
      },
    });

    if (trainers.length === 0) {
      console.log("length 000------")
      const randomTrainers = generateRandomTrainers({
        coordinates: [parseFloat(lat), parseFloat(lng)],
      });
      // console.log("-------------random trainer----------", randomTrainers);
      randomTrainers.forEach((trainer) => {
        console.log(trainer.location)
      });
      await TrainerSchema.insertMany(randomTrainers);

      return new HttpResponse(
        res,
        "Generated and added random trainers",
        randomTrainers,
        200
      ).sendResponse();
    }
    console.log("trainers------------", trainers);
    return new HttpResponse(
      res,
      "Get trainer by location",
      trainers,
      200
    ).sendResponse();
  } catch (error: any) {
    return new HttpResponse(res).sendErrorResponse(error);
  }
}

export async function addTrainers(req: Request, res: Response) {
  try {
    const trainersData = req.body;

    if (!Array.isArray(trainersData)) {
      return new HttpResponse(
        res,
        "Invalid data format",
        null,
        400
      ).sendResponse();
    }

    const newTrainers = await TrainerSchema.insertMany(trainersData);

    return new HttpResponse(
      res,
      "Add trainers",
      newTrainers,
      201
    ).sendResponse();
  } catch (error: any) {
    return new HttpResponse(res).sendErrorResponse(error);
  }
}
