import { TimetableType } from "@/types/TimetableTypes";
import Container from "../atoms/wrappers/Container";

import { IMG_BRAND_MARK } from "@/constants/img.cons";
import Image from "next/image";
import { Akatab } from "next/font/google";
import { ScheduleCard } from "../organisms/ScheduleCard";
import { FC } from "react";

const akatab = Akatab({ subsets: ["latin"], weight: ["400"] });

export const ScheduleTemplate: FC<{ timetable: TimetableType }> = (props) => {
  return (
    <Container>
      {/* Brandicon */}
      <div className="flex items-center justify-center pt-5 pb-4">
        <h1 className="font-bold text-lg">
          <Image
            src={IMG_BRAND_MARK}
            width={30}
            height={30}
            alt="OneDay"
            className="inline-block"
          />
        </h1>
      </div>

      {/* Title */}
      <div className="flex items-center justify-center mt-1 mb-6">
        <h1 className={`text-[#000000] opacity-70 text-md ${akatab.className}`}>
          {props.timetable.name}
        </h1>
      </div>

      {/* Schedle */}
      <div className={`mt-2 mb-10`}>
        <ScheduleCard timetable={props.timetable} />
      </div>
    </Container>
  );
};
