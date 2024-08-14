import { ConfigType } from "@/types/ConfigTypes";
import * as color from "@/constants/itemcolor.cons";

export const config: ConfigType = {
  name: "Daily Routine",
  quotes: [
    // {
    //   quote:
    //     "Motivation is what gets you started. Habit is what keeps you going",
    //   author: "Aristotle",
    // },
  ],

  timetable: [
    {
      name: "就寝",
      memo: "",
      start: "00:00",
      end: "07:00",
      color: color.ITEM_COLOR_PURPLE,
    },
    {
      name: "朝ルーティン（歯磨き、掃除）",
      memo: "",
      start: "07:00",
      end: "07:30",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "ジム",
      memo: "",
      start: "07:30",
      end: "08:30",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "シャワー、朝食",
      memo: "",
      start: "08:30",
      end: "09:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "家で仕事",
      memo: "",
      start: "09:00",
      end: "12:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "移動、昼食",
      memo: "",
      start: "12:00",
      end: "13:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "渋谷で仕事",
      memo: "",
      start: "13:00",
      end: "17:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "帰宅",
      memo: "",
      start: "17:00",
      end: "18:00",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "G、風呂",
      memo: "",
      start: "18:00",
      end: "19:00",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "夕食",
      memo: "",
      start: "19:00",
      end: "20:30",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "ハーブティー、明日の予定",
      memo: "",
      start: "20:30",
      end: "21:00",
      color: color.ITEM_COLOR_PINK,
    },
    {
      name: "重い読書",
      memo: "",
      start: "21:00",
      end: "22:30",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "YouTube",
      memo: "",
      start: "22:30",
      end: "23:00",
      color: color.ITEM_COLOR_YELLOW,
    },
    {
      name: "歯磨き、瞑想、ベッドで軽い読書",
      memo: "",
      start: "23:00",
      end: "23:30",
      color: color.ITEM_COLOR_BLUE,
    },
    {
      name: "ボディスキャン、就寝",
      memo: "",
      start: "23:30",
      end: "00:00",
      color: color.ITEM_COLOR_PURPLE,
    },
  ],
};
