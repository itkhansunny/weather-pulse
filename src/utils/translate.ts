export const translateNumber = (num: number | string, lang: string): string => {
  if (lang !== 'bn') return String(num);
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bengaliDigits[englishDigits.indexOf(w)]);
};
