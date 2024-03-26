import React from 'react';
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="wrapper flex flex-col flex-center flex-between gap-4 p-5 text-center text-sm sm:flex-row">
        <Link href="/">
          <Image src="/assets/images/logo.svg" alt="logo" width={128} height={38} />
        </Link>

        <p>2024 Evently - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;