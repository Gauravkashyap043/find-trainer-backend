import { model, Schema } from "mongoose";
import { IDatabaseSchema } from "../interfaces/IDatabaseSchema";

export interface TrainerModel {
  name: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  specialization: string;
  rating: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const trainerSchema = new Schema<TrainerModel>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bio: { type: String, required: true },
  specialization: { type: String, required: true },
  rating: { type: Number, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

trainerSchema.index({ location: '2dsphere' });

export const TrainerSchema = model<TrainerModel>(
  IDatabaseSchema.TRAINER_DATA,
  trainerSchema
);
