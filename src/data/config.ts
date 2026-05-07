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
      end: "07:30",
      color: color.ITEM_COLOR_PURPLE,
    },
    {
      name: "洗顔、水、腹ヨガ、坐禅、掃除",
      memo: "",
      start: "07:30",
      end: "08:30",
      color: color.ITEM_COLOR_GREEN,
    },
    {
      name: "ジム、シャワー",
      memo: "",
      start: "08:30",
      end: "09:30",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "朝食とコーヒー",
      memo: "",
      start: "09:30",
      end: "10:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "家でDeep Work",
      memo: "",
      start: "10:00",
      end: "13:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "移動、昼食",
      memo: "",
      start: "13:00",
      end: "14:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "外で仕事",
      memo: "",
      start: "14:00",
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
      name: "夕食",
      memo: "スーパーの惣菜で手軽に",
      start: "18:00",
      end: "19:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "娯楽",
      memo: "Twitter、長めのYouTube",
      start: "19:00",
      end: "20:00",
      color: color.ITEM_COLOR_PINK,
    },
    {
      name: "Wrap Up",
      memo: "Goalの確認、タスク棚卸し、明日のToDo作成",
      start: "20:00",
      end: "21:00",
      color: color.ITEM_COLOR_CYAN,
    },
    {
      name: "風呂、ストレッチ",
      memo: "",
      start: "21:00",
      end: "22:00",
      color: color.ITEM_COLOR_ORANGE,
    },
    {
      name: "語学",
      memo: "タイ語、中国語、英語",
      start: "22:00",
      end: "22:30",
      color: color.ITEM_COLOR_YELLOW,
    },
    {
      name: "読書",
      memo: "",
      start: "22:30",
      end: "24:00",
      color: color.ITEM_COLOR_BLUE,
    },
  ],
};
