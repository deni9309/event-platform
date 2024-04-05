import React from 'react';
import Link from "next/link";
import Image from "next/image";

import { SearchParamProps } from "@/types";
import { getAllEvents } from "@/lib/actions/event.actions";
import { Button } from "@/components/ui/button";
import Search from "@/components/shared/Search";
import Collection from "@/components/shared/Collection";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';

  const events = await getAllEvents({ query: searchText, category, page, limit: 6 });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-conatin py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Celebrate Your Events With Evently!</h1>
            <p className="p-regular-20 md:p-regular-24">
              A leading event platform, easy-to-use and with the lowest booking fees for event creation and fundraising pages.
            </p>
            <Button asChild size="lg" className="button w-full sm:w-fit " >
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
          <Image src="/assets/images/hero-3.png" alt="hero" width={1000} height={1000} className="max-h-[70dvh] object-contain object-center 2xl:max-h-[70dvh]" />
        </div>
      </section>

      <section id="events"
        className="wrapper flex flex-col gap-8 md:gap-12 my-8">
        <h2 className="h2-bold">Trust by <br /> Thousands of Events</h2>
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <Search />
          Category Filter
        </div>

        <Collection
          data={events?.data!}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
};