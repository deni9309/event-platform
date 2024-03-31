'use server';
import { revalidatePath } from "next/cache";

import { CreateEventParams } from "@/types";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Category from "../database/models/category.model";

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

export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));
    
    if (!event) throw new Error('404 - Event not found');

    return JSON.parse(JSON.stringify(event));
  } catch (error) { handleError(error); }
};

const populateEvent = async (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' });
};