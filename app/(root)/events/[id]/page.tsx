import React from 'react';
import Image from "next/image";

import { SearchParamProps, Event } from "@/types";
import { getEventById, getRelatedEventsByCategory } from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import Collection from "@/components/shared/Collection";
import CheckoutButton from "@/components/shared/CheckoutButton";

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const event: Event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image src={event.imageUrl} alt="event image" width={1000} height={1000} className="h-full min-h-[300px] object-cover object-center" />
          <div className="flex flex-col w-full gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h3 className="h3-medium">{event.title}</h3>

              {/* EVENT META */}
              <div className="flex flex-row md:flex-col flex-wrap items-center md:items-start md:gap-3 gap-2">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 text-green-700 px-5 py-2">{event.isFree ? 'FREE' : `$${event.price}`}</p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500 px-4 py-2.5">{event.category.name}</p>
                </div>
                <p className="p-medium-18 ml-2 md:ml-1 mt-0" >
                  by{' '}
                  <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              {/* EVENT DATE(S) */}
              <div className="flex gap-2 md:gap-3">
                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                <div className="flex flex-col p-medium-16">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly}{' - '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <hr className="my-1 border-primary/25" />
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly}{' - '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              {/* LOCATION */}
              <div className="flex items-center gap-3 p-regular-20">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16">{event.location}</p>
              </div>
            </div>
            {/* DESCRIPTION */}
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Topic and description:</p>
              <p className="p-regular-16 lg:p-regular-18 !leading-7">{event.description}</p>
              <p className="text-primary-500 underline truncate p-regular-16 lg:p-regular-18">{event.url}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED EVENTS (WITH THE SAME CATEGORY) */}
      <section className="wrapper flex flex-col gap-8 md:gap-12 my-8">
        <h5 className="h5-bold">Related Events</h5>

        <Collection
          data={relatedEvents?.data!}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;;