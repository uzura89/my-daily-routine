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
      end: "07:00",
      color: color.ITEM_COLOR_PURPLE,
    },
    {
      name: "Morning Routine",
      memo: "Clean, Yoga or Meditation, Shower, Breakfast",
      start: "07:00",
      end: "08:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "Coffee & Sprint Work",
      memo: "Small yet important tasks",
      start: "08:00",
      end: "09:30",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "Go to work",
      memo: "",
      start: "09:30",
      end: "10:00",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "Deep Work",
      memo: "Heavy & important tasks",
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
      end: "16:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "Go home",
      memo: "",
      start: "16:00",
      end: "16:30",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "Exercise & Shower",
      memo: "",
      start: "16:30",
      end: "17:30",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "Dinner",
      memo: "Cook healthy meal",
      start: "17:30",
      end: "19:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "Free Time",
      memo: "",
      start: "19:00",
      end: "21:00",
      color: color.ITEM_COLOR_YELLOW,
    },
    {
      name: "Diary & Reading",
      memo: "Put away electronic devices, make herbal tea, check long-term goals & plan for tomorrow, read books",
      start: "21:00",
      end: "23:00",
      color: color.ITEM_COLOR_BLUE,
    },
    {
      name: "Sleep",
      memo: "No smartphone",
      start: "23:00",
      end: "24:00",
      color: color.ITEM_COLOR_PURPLE,
    },
  ],
};
