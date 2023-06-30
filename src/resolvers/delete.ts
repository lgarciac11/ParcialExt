import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { slotsCollection, doctorsCollection } from "../db/mongo.ts";
import { getQuery } from "oak/helpers.ts";


type RemoveDoctorContext = RouterContext<
"/removeDoctor",
Record<string | number, string | undefined>,
Record<string, any>
>;
type RemoveSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeDoctor = async (context: RemoveDoctorContext) => {
try{
  const doctor = getQuery(context, {mergeParams: true});
  if(!doctor.name || !doctor.lastname || !doctor.specialty) {
    context.response.status = 406;
    return;
  }
  const {name, lastname, age, specialty} = doctor;
  const doctors = await doctorsCollection.findOne({
    name: name,
    lastname: lastname,
    age: parseInt(age),
    specialty: specialty,
  });
  if(!doctor){
    context.response.status = 404;
    return;
  }
  await slotsCollection.deleteMany({_id: doctors._id});
  await doctorsCollection.deleteOne({_id: doctors._id});
  context.response.status = 200;
}catch(e){
  console.error(e);
  context.response.status = 500;
}
}
export const removeSlot = async (context: RemoveSlotContext) => {
    try {
      const params = getQuery(context, { mergeParams: true });
      if (!params.year || !params.month || !params.day || !params.hour) {
        context.response.status = 406;
        return;
      }
      const { year, month, day, hour } = params;
      const slot = await slotsCollection.findOne({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour),
      });
      if (!slot) {
        context.response.status = 404;
        return;
      }
      if (!slot.available) {
        context.response.status = 403;
        return;
      }
  
      await slotsCollection.deleteOne({ _id: slot._id });
      context.response.status = 200;
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
  };