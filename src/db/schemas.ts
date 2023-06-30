import { ObjectId } from "mongo";
import { Doctor, Slot } from "../types.ts";

export type SlotSchema = Slot & {
  _id: ObjectId;
};

export type DoctorSchema = Doctor & {
  _id: ObjectId;
}