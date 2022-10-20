import { DateTime } from 'luxon';

const DEFAULT_TIMEZONE = 'Etc/UTC';

const currentBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const date = (
  millis: number | string,
  timezone = DEFAULT_TIMEZONE,
): DateTime => {
  if (typeof millis === 'string') millis = Number(millis);
  return DateTime.fromMillis(millis, { zone: timezone });
};

/**
 * Format rules https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 */
const format = (
  millis: number | string,
  format = 'DD',
  timezone: string = DEFAULT_TIMEZONE,
): string => {
  if (typeof millis === 'string') millis = Number(millis);
  return date(millis, timezone).toFormat(format);
};

const now = (timezone: string = DEFAULT_TIMEZONE): number => {
  return DateTime.fromMillis(DateTime.now().toMillis(), {
    zone: timezone,
  }).toMillis();
};

const TimeUtil = {
  currentBrowserTimezone,
  now,
  date,
  format,
};

export default TimeUtil;
