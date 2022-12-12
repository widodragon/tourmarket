import React, { FC } from 'react';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import styles from './Datepicker.module.css';

export interface DatePickerComponentProps {
  className?: string;
  value: any;
  onChange: any;
  placeholder?: string;
  wrapperPicker?: any;
  inputPicker?: any;
}

const customLocale = {
  // months list by order
  months: [
    'Jnauari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  // week days by order
  weekDays: [
    {
      name: 'Minggu', // used for accessibility
      short: 'Min', // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: 'Senin',
      short: 'Sen',
    },
    {
      name: 'Selasa',
      short: 'Sel',
    },
    {
      name: 'Rabu',
      short: 'Rab',
    },
    {
      name: 'Kamis',
      short: 'Kam',
    },
    {
      name: 'Jumat',
      short: 'Jum',
    },
    {
      name: 'Sabtu',
      short: 'Sab',
      isWeekend: true,
    },
  ],
  // just play around with this number between 0 and 6
  weekStartingIndex: 0,
  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject: any) {
    return gregorainTodayObject;
  },
  // return a native JavaScript date here
  toNativeDate(date: any) {
    return new Date(date.year, date.month - 1, date.day);
  },
  // return a number for date's month length
  getMonthLength(date: any) {
    return new Date(date.year, date.month, 0).getDate();
  },
  // return a transformed digit to your locale
  transformDigit(digit: any) {
    return digit;
  },
  // texts in the date picker
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  defaultPlaceholder: 'Select...',
  // for input range value
  from: '',
  to: '-',
  // used for input value when multi dates are selected
  digitSeparator: ',',
  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,
  // is your language rtl or ltr?
  isRtl: false,
};

const DatePickerComponent: FC<DatePickerComponentProps> = ({
  value = '',
  onChange = {},
  placeholder = 'Pilih tanggal',
  wrapperPicker = styles.wrapperPicker,
  inputPicker = styles.inputPicker,
}) => {
  return (
    <div>
      <DatePicker
        value={value}
        onChange={(data: any) => onChange(data)}
        inputPlaceholder={placeholder}
        shouldHighlightWeekends
        wrapperClassName={wrapperPicker}
        inputClassName={inputPicker}
        locale={customLocale}
        // minimumDate={utils('en').getToday()}
        // maximumDate={{
        //   ...utils('en').getToday(),
        //   year:
        //     Number(utils('en').getToday().month) + 3 > 12
        //       ? Number(utils('en').getToday().year) + 1
        //       : Number(utils('en').getToday().year),
        //   month:
        //     Number(utils('en').getToday().month) + 3 > 12
        //       ? Number(utils('en').getToday().month) + 3 - 12
        //       : Number(utils('en').getToday().month) + 3,
        // }}
      />
    </div>
  );
};

export default DatePickerComponent;
