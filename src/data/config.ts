import { ConfigType } from "@/types/ConfigTypes";
import * as color from "@/constants/itemcolor.cons";

export const config: ConfigType = {
  name: "Daily Routine",
  /* 
  leave the quotes blank
  or remove the quotes 
  for random stoic quotes,
  add one or more to cycle 
  between your own quotes
  */
  quotes: [
    // {
    //   quote:
    //     "Motivation is what gets you started. Habit is what keeps you going",
    //   author: "Aristotle",
    // },
  ],

  timetable: [
    {
      name: "Sleep",
      memo: "",
      start: "00:00",
      end: "08:00",
      color: color.ITEM_COLOR_PURPLE,
    },
    {
      name: "Morning Routine",
      memo: "Clean, Yoga or Meditation, Gym, Shower, Breakfast",
      start: "08:00",
      end: "09:30",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "Move",
      memo: "",
      start: "09:30",
      end: "10:00",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "Reading & Deep Work",
      memo: "Read knowledge books, do important tasks, either at cafe or coworking space",
      start: "10:00",
      end: "13:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "Lunch",
      memo: "",
      start: "13:00",
      end: "14:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "Light Work",
      memo: "Not important tasks",
      start: "14:00",
      end: "17:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "Go home",
      memo: "",
      start: "17:00",
      end: "17:30",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "Shower",
      memo: "",
      start: "17:30",
      end: "18:00",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "Dinner & Free Time",
      memo: "",
      start: "18:00",
      end: "21:00",
      color: color.ITEM_COLOR_YELLOW,
    },
    {
      name: "Study & Learn Languages",
      memo: "Learn languages, watch educational videos, study something interesting",
      start: "21:00",
      end: "22:00",
      color: color.ITEM_COLOR_PINK,
    },
    {
      name: "Diary & Reading",
      memo: "Put away electronic devices, make herbal tea, check long-term goals & plan for tomorrow, read books",
      start: "22:00",
      end: "24:00",
      color: color.ITEM_COLOR_BLUE,
    },
  ],
};
