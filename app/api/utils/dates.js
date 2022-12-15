/* eslint-disable implicit-arrow-linebreak */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export const convertDateWithDotToStandardDate = (date) => {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
};
