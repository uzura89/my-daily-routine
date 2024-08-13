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
      end: "11:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "移動",
      memo: "",
      start: "11:00",
      end: "11:30",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "カフェで仕事",
      memo: "",
      start: "11:30",
      end: "13:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "昼食、移動",
      memo: "",
      start: "13:00",
      end: "14:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "コワークで仕事",
      memo: "",
      start: "14:00",
      end: "17:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "帰宅、娯楽",
      memo: "",
      start: "17:00",
      end: "18:00",
      color: color.ITEM_COLOR_GRAY,
    },
    {
      name: "風呂読書",
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
      name: "ハーブティ、明日の予定",
      memo: "",
      start: "20:30",
      end: "21:00",
      color: color.ITEM_COLOR_PINK,
    },
    {
      name: "重い読書",
      memo: "",
      start: "21:00",
      end: "22:00",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "YouTube、Twitter",
      memo: "",
      start: "22:00",
      end: "23:00",
      color: color.ITEM_COLOR_YELLOW,
    },
    {
      name: "就寝準備",
      memo: "歯磨き・ヨガ・ベッドで軽い読書",
      start: "23:00",
      end: "24:00",
      color: color.ITEM_COLOR_BLUE,
    },
  ],
};
