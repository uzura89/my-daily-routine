export type TimetableItemType = {
  name: string;
  memo: string;
  start: string;
  end: string;
  color: string;
};

export type TimetableType = {
  name: string;
  items: TimetableItemType[];
  quotes?: QuoteType[];
};

export type QuoteType = {
  quote: string;
  author: string;
};
