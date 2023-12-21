export type TimetableItemType = {
  name: string;
  memo: string;
  start: string;
  end: string;
  color: string;
};

export type TimetableType = TimetableItemType[];

export type ConfigType = {
  name: string;
  quotes?: QuoteType[];
  timetable: TimetableItemType[];
};

export type QuoteType = {
  quote: string;
  author: string;
};
