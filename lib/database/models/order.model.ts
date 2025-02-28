import { Event } from "@/types";
import { Document, model, models, Schema } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: { _id: string, title: string, };
  buyer: { _id: string, firstName: string, lastName: string, };
}

export type TOrder = {
  _id: string;
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: Event;
  buyer: string;
}

export type TOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  totalAmount: { type: String },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;