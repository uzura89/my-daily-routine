"use client";

import { ScheduleTemplate } from "@/components/templates/ScheduleTemplate";
import { config } from "@/data/config";

export default function Home() {
  return <ScheduleTemplate config={config} />;
}
