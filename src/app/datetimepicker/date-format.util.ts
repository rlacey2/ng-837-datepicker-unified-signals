import { PickerModeType, SupportedDateFormat } from './datetimepicker.types';

export function formatDateTimeValue(
  val: Date | null,
  pickerType: PickerModeType,
  dateFormat: SupportedDateFormat = 'dd/MM/yyyy',
  hour24 = true
): string {
  if (!val) return '';


 const isUtc = typeof val === 'string' && /Z$/i.test(val);


   const date = val instanceof Date
    ? val
    : new Date(val);

  // Reject invalid dates.
  if (isNaN(date.getTime())) return '';

 

  const dd = (isUtc ? date.getUTCDate() : date.getDate())
    .toString().padStart(2, '0');

  const mm = ((isUtc ? date.getUTCMonth() : date.getMonth()) + 1)
    .toString().padStart(2, '0');

  const yyyy = isUtc ? date.getUTCFullYear() : date.getFullYear();

  let datePart = `${dd}/${mm}/${yyyy}`;
  if (dateFormat === 'MM/dd/yyyy') {
    datePart = `${mm}/${dd}/${yyyy}`;
  } else if (dateFormat === 'yyyy-MM-dd') {
    datePart = `${yyyy}-${mm}-${dd}`;
  }

  const rawHours = date.getHours();
  const min = date.getMinutes().toString().padStart(2, '0');

  let timePart = '';
  if (hour24) {
    const hh = rawHours.toString().padStart(2, '0');
    timePart = `${hh}:${min}`;
  } else {
    const period = rawHours >= 12 ? 'PM' : 'AM';
    const h12 = (rawHours % 12 || 12).toString().padStart(2, '0');
    timePart = `${h12}:${min} ${period}`;
  }

  switch (pickerType) {
    case 'calendar':
      return datePart;
    case 'timer':
      return timePart;
    default:
      return `${datePart} ${timePart}`;
  }
}
