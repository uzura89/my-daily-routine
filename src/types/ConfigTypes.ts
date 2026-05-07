export type TimetableItemType = {
  id: string;
  name: string;
  memo: string;
  start: string;
  end: string;
  color: string;
};

export type TimetableType = TimetableItemType[];

export type SeedTimetableItem = Omit<TimetableItemType, "id">;

export type BoardType = {
  id: string;
  name: string;
  timetable: TimetableType;
};

export type BoardsStateType = {
  boards: BoardType[];
  activeBoardId: string;
};

export type ConfigType = {
  name: string;
  quotes?: QuoteType[];
  timetable: SeedTimetableItem[];
};

export type QuoteType = {
  quote: string;
  author: string;
};
