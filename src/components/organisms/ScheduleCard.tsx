import Card from "../atoms/wrappers/Card";
import { FC } from "react";
import { Quote } from "../molecules/Quote";
import { Schedule, ScheduleProps } from "../molecules/Schedule";

export const ScheduleCard: FC<ScheduleProps> = (props) => {
  return (
    <Card noPadding>
      <div className="pb-6">
        <Quote />
        <Schedule {...props} />
      </div>
    </Card>
  );
};
