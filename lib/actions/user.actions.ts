'use server';
import { revalidatePath } from "next/cache";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Order from "@/lib/database/models/order.model";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId: clerkId }, user, { new: true });
    if (!updateUser) throw new Error('User update failed');

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId: clerkId }); //find user to delete
    if (!userToDelete) throw new Error('User not found');

    // unlink relationships
    await Promise.all([
      //update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      //update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      )
    ]);

    // delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}