import Card from "../atoms/wrappers/Card";
import { FC } from "react";
import { Quote } from "../molecules/Quote";
import { Schedule } from "../molecules/Schedule";
import { TimetableType } from "@/types/ConfigTypes";

export const ScheduleCard: FC<{ timetable: TimetableType }> = (props) => {
  return (
    <Card noPadding>
      <div className="pb-6">
        {/* Header */}
        <Quote />

        {/* Schedule */}
        <Schedule timetable={props.timetable} />
      </div>
    </Card>
  );
};
