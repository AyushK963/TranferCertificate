"use client";

import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex items-center justify-center bg-indigo-100 p-6 shadow-md rounded-md print:border-b print:border-black print:mb-4">
      {/* Gandhiji Image */}
      <div className="mr-6 flex-shrink-0">
        <Image
          src="/img.jpg"
          alt="Gandhiji"
          width={100}
          height={100}
          className="rounded-full border border-gray-300 shadow-md object-cover"
        />
      </div>

      {/* School Information */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
          Shri Gandhi Inter College, Orai Jalaun
        </h1>
        <p className="text-lg font-semibold italic text-gray-700 mt-1">
          "शिक्षार्थ आइये, सेवार्थ जाइये"
        </p>
        <p className="text-base text-gray-800 font-medium">
          Station Road, Orai, Jalaun, Uttar Pradesh
        </p>
        <p className="text-base text-gray-800 font-medium">
          <a
            href="https://www.sgicorai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            www.sgicorai.com
          </a>{" "} | Email: sgicorai@gmail.com
        </p>
        <p className="text-base text-gray-800 font-medium">
          UDISE: 09351300212 | School Code: 45-1032
        </p>
        <h2 className="text-xl font-bold text-gray-800 mt-2">
          Transfer Certificate Management
        </h2>
      </div>
    </div>
  );
};

export default Header;
