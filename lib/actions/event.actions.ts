'use server';
import { revalidatePath } from "next/cache";

import {
  CreateEventParams,
  GetAllEventsParams,
  Event as EventType,
  DeleteEventParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
  GetEventsByUserParams
} from "@/types";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Category from "@/lib/database/models/category.model";

export const createEvent = async ({ userId, event, path }: CreateEventParams) => {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) {
      throw new Error('401 Unauthorized - User with this ID does not exist!');
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));
    if (!event) {
      throw new Error('404 - Event not found');
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate) {
      throw new Error('Event Not Found');
    }
    if (eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized Request');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
};

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};

export const getAllEvents = async ({ query, limit = 6, page, category }: GetAllEventsParams) => {
  try {
    await connectToDatabase();

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {};
    const categoryCondition = category ? await getCategoryByName(category) : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {}
      ]
    };
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)) as EventType[],
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

/**
 * Gets events by a specific user
 */
export const getEventsByUser = async ({ userId, limit = 6, page }: GetEventsByUserParams) => {
  try {
    await connectToDatabase();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get related events (put in the same category)
 */
export const getRelatedEventsByCategory = async ({
  categoryId, eventId, limit = 3, page = 1
}: GetRelatedEventsByCategoryParams) => {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    };
  } catch (error) {
    handleError(error);
  }
};

const populateEvent = async (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' });
};

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } });
};