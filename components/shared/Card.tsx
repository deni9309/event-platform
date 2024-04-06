import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs";

import { Event as EventType } from '@/types';
import { formatDateTime } from "@/lib/utils";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
  event: EventType,
  hasOrderLink?: boolean,
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group flex flex-col w-full max-w-[400px] min-h-[380px] md:min-h-[438px] overflow-hidden relative rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow text-grey-500 bg-grey-50 bg-cover bg-center"
      />
      { /* EVENT CREATOR ONLY */}
      {isEventCreator && !hidePrice && (
        <div className="flex flex-col absolute gap-4 right-2 top-2 rounded-xl bg-white shadow-sm p-3 transition-all ">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="flex flex-col gap-3 md:gap-4 min-h-[230px] p-5">
        {!hidePrice &&
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full text-green-60 bg-green-100 px-4 py-1">{event.isFree ? 'FREE' : `$${event.price}`}</span>
            <p className="p-semibold-14 rounded-full text-grey-500 bg-green-500/10 px-4 py-1 line-clamp-1">{event.category.name}</p>
          </div>
        }
        <p className="text-grey-600 p-medium-14 md:p-medium-16">{formatDateTime(event.startDateTime).dateTime}</p>
        <Link href={`/events/${event._id}`}>
          <p className="flex-1 p-medium-16 md:p-medium-20 md:max-h-[63px] max-h-[50px] line-clamp-2">{event.title}</p>
        </Link>
        <div className="flex-between w-full">
          <p className="text-grey-600 p-medium-14 md:p-medium-16">{event.organizer.firstName} {event.organizer.lastName}</p>
          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500 p-medium-14 md:p-medium-16">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="arrow" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
