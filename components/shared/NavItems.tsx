'use client';
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

import { headerLinks } from "@/constants";

const NavItems = () => {
  const pathName = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link, i) => {
        const isActive = pathName === link.route;

        return (
          <li key={i}
            className={`${isActive && 'text-primary-500'} flex-center p-medium-16 whitespace-nowrap`}>
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;