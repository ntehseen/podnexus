import React from "react";
import { EmptyStateProps } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyState = ({
  title,
  search,
  buttonLink,
  buttonText,
}: EmptyStateProps) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image
        src="/icons/empty-hourglass.svg"
        width={250}
        height={250}
        alt="empty state"
      />

      <div className="flex-center w-full max-w-[254px] flex-col gap-3 ">
        <h1 className="text-16 text-center font-medium text-white-1">
          {title}
        </h1>

        {search && (
          <p className="text-16 text-center font-medium text-white-2">
            Redefine Search
          </p>
        )}

        {buttonLink && (
          // <Button className="bg-cyan-1">
          //     <Link href={buttonLink} className="gap-1 flex  ">
          //     <Image
          //     src="/icons/discover.svg"
          //     width={20}
          //     height={20}
          //     alt="discover"

          //     />

          //     <h1 className="text-16 font-extrabold text-white-1">{buttonText}</h1>
          //     </Link>
          // </Button>

          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <Link href={buttonLink} className="gap-1 flex  ">
              <Image
                src="/icons/discover-2.svg"
                width={20}
                height={20}
                alt="discover"
              />

              <h1 className="text-16 font-extrabold text-white-1">
                {buttonText}
              </h1>
            </Link>
          </button>
        )}
      </div>
    </section>
  );
};

export default EmptyState;
