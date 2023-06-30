import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { doctorsCollection, slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";

type GetDoctorsContext = RouterContext<
"/getDoctors", 
Record<string | number, string | undefined>,
Record<string, any>
>;
type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getDoctors = async (context: GetDoctorsContext) =>{
  try{
    const params = getQuery(context, {mergeParams: true});
    if(!params.specialty){
      context.response.status = 403;
      return;
    }
    const {name, lastname, age, specialty} = params;
    const doctors = await doctorsCollection.find({
      name: name,
      lastname: lastname,
      age: parseInt(age),
      specialty: specialty,
    }).toArray();
    context.response.body = doctors.map((doctor) => {
      const { _id, ...rest } = doctor;
      return rest;
    });

  }catch(e){
    console.error(e);
    context.response.status = 500;
  }
}
export const availableSlots = async (context: GetAvailabeSlotsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.year || !params.month) {
      context.response.status = 403;
      return;
    }

    const { year, month, day } = params;
    if (!day) {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          available: true,
        })
        .toArray();
      context.response.body = context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    } else {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          available: true,
        })
        .toArray();
      context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
