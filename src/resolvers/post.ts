import { RouterContext } from "oak/router.ts";
import { DoctorSchema, SlotSchema } from "../db/schemas.ts";
import { Doctor, Slot } from "../types.ts";
import { doctorsCollection, slotsCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

type PostAddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostAddDoctorContext = RouterContext<
  "/addDoctor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


// months are 0-indexed, so 0 is January, 1 is February, etc.
const isValidDate = (
  year: number,
  month: number,
  day: number,
  hour: number
): boolean => {
  const date = new Date(year, month, day, hour);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day &&
    date.getHours() === hour
  );
};

export const addDoctor = async (context: PostAddDoctorContext): Promise<void> => {
  try {
    const result = context.request.body({ type: "json" });
    const doctor: Doctor = await result.value;

    if (!doctor?.name || !doctor?.lastname || !doctor?.specialty) {
      context.response.status = 406;
      return;
    }

    const { age, lastname, name, specialty} = doctor;
    
    const found = await doctorsCollection.findOne({
        name: name,
        lastname: lastname,
        age: age,
      });
  
      if (found) {
        context.response.status = 409; 
        return;
      }

    await doctorsCollection.insertOne(doctor);

    context.response.body = doctor;

  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
}

export const addSlot = async (context: PostAddSlotContext): Promise<void> => {
  try {
    const result = context.request.body({ type: "json" });
    const value: Slot = await result.value;
    if (!value?.day || !value?.month || !value?.year || !value?.hour || !value?.doctorId) {
      context.response.status = 406;
      return;
    }

    const { day, month, year, hour, doctorId } = value;

    // check if date is valid
    if (!isValidDate(year, month - 1, day, hour)) {
      context.response.status = 406;
      return;
    }

    // check the doctor id is valid
    const foundDoctor = await doctorsCollection.findOne({
      _id: new ObjectId(doctorId)
    })

    if (!foundDoctor) {
      context.response.status = 404;
      return;
    }

    // check if slot is already booked
    const foundSlot = await slotsCollection.findOne({ day, month, year, hour });
    if (foundSlot) {
      if (!foundSlot.available) {
        context.response.status = 409;
        return;
      } else {
        context.response.status = 200;
        return;
      }
    }

    const slot: Partial<Slot> = {
      ...value,
      available: true,
    };

    await slotsCollection.insertOne(slot);
    // const { _id, ...slotWithoutId } = slot as SlotSchema;
    context.response.body = slot;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
