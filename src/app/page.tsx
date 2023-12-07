"use client";

import ScheduleTemplate from "@/components/templates/ScheduleTemplate";
import { timetable } from "@/data/timetable";

export default function Home() {
  return <ScheduleTemplate timetable={timetable} />;
}
