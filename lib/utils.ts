import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';

import { RemoveUrlQueryParams, UrlQueryParams } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (input: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDateTime: string = new Date(input).toLocaleString('en-US', dateTimeOptions);
  const formattedDate: string = new Date(input).toLocaleString('en-US', dateOptions);
  const formattedTime: string = new Date(input).toLocaleString('en-US', timeOptions);

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const formatPrice = (priceString: string) => {
  const amount = parseFloat(priceString);

  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(amount);

  return formatted;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach(key => { delete currentUrl[key]; });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl
    },
    { skipNull: true }
  );
}

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
};