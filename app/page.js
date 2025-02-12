/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import aidlogo from "@/public/aidlogo.svg";
import avlogo from "@/public/avlogo.svg";
import dates from "@/public/dates.svg";
import vidharbha from "@/public/vidharbha.png";
//import ministerPhoto from "@/public/nitinjig.png";
import lefttovidhr from "@/public/lefttovidhr.svg";
import infivent from "@/public/infivent.svg";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="w-full p-4 flex justify-center items-center gap-4">
        <img
          src={
            "https://res.cloudinary.com/deppmhu84/image/upload/v1737980403/aidlogo_zbamwx.png"
          }
          alt="AID Logo"
          width={80}
          height={80}
          className="object-contain"
        />
        <img
          src={
            "https://res.cloudinary.com/deppmhu84/image/upload/v1737980747/avlogo_pbae78.png"
          }
          alt="Advantage Vidarbha Logo"
          width={120}
          height={80}
          className="object-contain"
        />
        <img
          src={
            "https://res.cloudinary.com/deppmhu84/image/upload/v1737980830/dates_erqwpg.png"
          }
          alt="Advantage Vidarbha Logo"
          width={150}
          height={80}
          className="object-contain"
        />
      </header>
      <main className="bg-cover bg-center bg-no-repeat bg-[url('https://res.cloudinary.com/deppmhu84/image/upload/v1737980965/bg_zqnd7f.png')] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between justify-center items-center gap-8 px-4 lg:px-16">
          <div className=" w-full lg:mr-[5em] mr-0">
            <div className="relative w-full aspect-[4/3] lg:left-[5em] left-0">
              <img
                src={
                  "https://res.cloudinary.com/deppmhu84/image/upload/v1737981125/map_ahehtm.png"
                }
                alt="Vidarbha Region Highlights"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="relative w-full lg:w-[75%] lg:mr-[15em] h-[45%]">
            <div className="relative w-full">
              <img
                src={
                  "https://res.cloudinary.com/deppmhu84/image/upload/v1737981235/logodate_sa13tt.png"
                }
                alt="Left to Vidarbha"
                className="lg:w-[65%] w-full h-1/2"
              />

              <div className="relative flex flex-col items-center lg:items-end lg:top-[-5em] top-0 lg:left-[1em] left-0 w-full">
                <img
                  src={
                    "https://res.cloudinary.com/deppmhu84/image/upload/v1737981428/ng_lskxio.png"
                  }
                  alt="Minister"
                  width={700}
                  height={1500}
                  className="lg:max-w-none w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Registration buttons */}
        <div className="w-96 mt-0 max-w-4xl mx-auto">
          {/* <Link href="/signup-visitor" className="w-full">
            <Button
              className="w-full py-6 text-xl bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              Visitor
            </Button>
          </Link>
          <Link href="/signup-exhibitor" className="w-full">
            <Button
              className="w-full py-6 text-xl bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              Exhibitor
            </Button>
          </Link> */}
          {/* <Link href="/speaker" className="w-full">
            <Button
              className="w-full py-6 text-xl bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              Speaker
            </Button>
          </Link> */}
          <Link href="/signup-delegates" className="w-full">
            <Button
              className="w-full py-6 text-xl bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
             Registration
            </Button>
          </Link>
        </div>

        {/* Login section */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-4 text-[#001E87]">
            <hr className="bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[0.2em] w-1/4" />
            <span>or</span>
            <hr className="bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[0.2em] w-1/4" />
          </div>
          <p className="text-[#001E87]">
            Are you an Exhibitor?{" "}
            <Link
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
          <div className="mt-4 flex justify-center items-center gap-2 text-sm text-gray-600">
            Powered by{" "}
            <Image
              src={infivent}
              alt="Infivent Logo"
              width={100}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
      </main>
      <Analytics />
    </div>
  );
}
