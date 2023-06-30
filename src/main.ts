import { Application, Router } from "oak";

import { removeDoctor, removeSlot } from "./resolvers/delete.ts";
import { availableSlots, getDoctors } from "./resolvers/get.ts";
import { addDoctor, addSlot } from "./resolvers/post.ts";
import { bookSlot } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addDoctor", addDoctor)
  .post("/addSlot", addSlot)
  .delete("/removeDoctor", removeDoctor)
  .delete("/removeSlot", removeSlot)
  .get("/getDoctors", getDoctors)
  .get("/availableSlots", availableSlots)
  .put("/bookSlot", bookSlot);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
