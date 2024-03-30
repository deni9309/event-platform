'use server';
import { revalidatePath } from "next/cache";

import { CreateEventParams } from "@/types";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";

export const createEvent = async ({ userId, event, path }: CreateEventParams) => {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error('401 Unauthorized - Organizer with given ID does not exist!');

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) { handleError(error); }
};