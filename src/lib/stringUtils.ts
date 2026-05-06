export const toTitleCase = (str: string | undefined) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

export const formatPrice = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 10000000) return (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
  return num.toLocaleString('en-IN');
};