export function convertDateToDateStr(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthTwoDigits = month.toString().padStart(2, "0");
  const dayTwoDigits = day.toString().padStart(2, "0");
  return `${year}-${monthTwoDigits}-${dayTwoDigits}`;
}
