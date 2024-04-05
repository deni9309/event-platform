import React from 'react';

import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { SearchParamProps } from "@/types";
import Search from "@/components/shared/Search";
import { formatDateTime, formatPrice } from "@/lib/utils";

const OrdersPage = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || '';
  const searchText = (searchParams?.query as string) || '';

  const orders = await getOrdersByEvent({ eventId, searchString: searchText }) || [];

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Orders</h3>
      </section>
      <section className="wrapper mt-8">
        <Search placeholder="Search buyer name..." />
      </section>

      <section className="wrapper overflow-x-auto">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="text-grey-500 border-b p-medium-14">
              <th className="min-w-[90px] sm:min-w-[200px] py-3 text-left">Order ID</th>
              <th className="min-w-[220px] flex-1 py-3 px-1 text-left">Event Title</th>
              <th className="min-w-[100px] py-3 px-1 text-left">Buyer</th>
              <th className="min-w-[90px] py-3 px-1 text-left">Created</th>
              <th className="min-w-[60px] py-3 px-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr className="border-b">
                <td colSpan={5} className="text-grey-500 text-center py-4">No Orders Found.</td>
              </tr>
            ) : (
              <>
                {orders && orders.map(row => (
                  <tr key={row._id} style={{ boxSizing: 'border-box' }} className="text-sm sm:p-regular-14 xl:p-regular-16 border-b flex-wrap align-top">
                    <td className="min-w-[90px] sm:min-w-[200px] py-4 pl-1 pr-3 text-primary-500 break-all md:break-keep">{row._id}</td>
                    <td className="min-w-[220px] flex-1 py-4 px-1">{row.eventTitle}</td>
                    <td className="min-w-[100px] py-4 px-1">{row.buyer}</td>
                    <td className="min-w-[90px] py-4 px-1">{formatDateTime(row.createdAt).dateTime}</td>
                    <td className="min-w-[60px] py-4 px-1 text-right">{formatPrice(row.totalAmount)}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default OrdersPage;