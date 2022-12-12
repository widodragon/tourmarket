import React, { useEffect, useState } from 'react';
import {
  AnchorDirectionShape,
  DateRangePicker,
  SingleDatePicker,
  FocusedInputShape,
} from 'react-dates';
import { DateRage } from './StaySearchForm';
import { FC } from 'react';
import useWindowSize from 'hooks/useWindowResize';
import useNcId from 'hooks/useNcId';
import moment from 'moment';

export interface StayDatesRangeInputProps {
  defaultValue: any;
  defaultFocus?: FocusedInputShape | null;
  onChange?: (data: string | null) => void | null;
  onFocusChange?: (focus: FocusedInputShape | null) => void;
  className?: string;
  fieldClassName?: string;
  wrapClassName?: string;
  numberOfMonths?: number;
  anchorDirection?: AnchorDirectionShape;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = null,
  onFocusChange,
  className = '[ lg:nc-flex-2 ]',
  fieldClassName = '[ nc-hero-field-padding ]',
  wrapClassName = '',
  numberOfMonths,
  anchorDirection,
}) => {
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [stateDate, setStateDate] = useState(defaultValue);
  const startDateId = useNcId();
  const endDateId = useNcId();
  const windowSize = useWindowSize();

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  const handleDateFocusChange = (focus: FocusedInputShape | null) => {
    setFocusedInput(focus);
    onFocusChange && onFocusChange(focus);
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput === 'startDate';
    return (
      <div
        className={`relative flex w-full ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? 'nc-hero-field-focused' : ' '
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
            {stateDate ? stateDate.format('DD MMM YYYY') : 'Selected date'}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate ? 'Selected date' : `Add date`}
          </span>
        </div>
      </div>
    );
  };

  const renderInputCheckOutDate = () => {
    const focused = focusedInput === 'endDate';
    return (
      <div
        className={`relative flex ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? 'nc-hero-field-focused' : ' '
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
            {stateDate.endDate
              ? stateDate.endDate.format('DD MMM YYYY')
              : 'Check out'}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.endDate ? 'Check out' : `Add date`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`StayDatesRangeInput relative flex z-10 ${className} ${
        !!focusedInput ? 'nc-date-focusedInput' : 'nc-date-not-focusedInput'
      }`}
    >
      {/* <div className="absolute inset-0 flex">
        <DateRangePicker
          startDate={stateDate}
          endDate={stateDate.endDate}
          focusedInput={focusedInput}
          onDatesChange={(date) => {
            setStateDate(date);
            // onChange && onChange("");
          }}
          onFocusChange={handleDateFocusChange}
          numberOfMonths={
            numberOfMonths || (windowSize.width < 1024 ? 1 : undefined)
          }
          startDateId={startDateId}
          endDateId={endDateId}
          daySize={
            windowSize.width >= 1024
              ? windowSize.width > 1279
                ? 56
                : 44
              : undefined
          }
          orientation={"horizontal"}
          showClearDates
          noBorder
          hideKeyboardShortcutsPanel
          anchorDirection={anchorDirection}
          customArrowIcon={<div />}
          reopenPickerOnClearDates
        />
      </div> */}
      <div className="absolute inset-0 flex">
        <SingleDatePicker
          date={stateDate} // momentPropTypes.momentObj or null
          onDateChange={(date) => {
            setFocusedInput('endDate');
            setStateDate(date);
            onChange?.(moment(date).format('YYYY-MM-DD'));
          }} // PropTypes.func.isRequired
          focused={focusedInput === 'startDate' ? true : false} // PropTypes.bool
          onFocusChange={() => {
            if (focusedInput === 'startDate') {
              setFocusedInput('endDate');
            } else {
              setFocusedInput('startDate');
            }
          }} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
          numberOfMonths={
            numberOfMonths || (windowSize.width < 1024 ? 1 : undefined)
          }
          daySize={
            windowSize.width >= 1024
              ? windowSize.width > 1279
                ? 56
                : 44
              : undefined
          }
          orientation={'horizontal'}
          noBorder
          hideKeyboardShortcutsPanel
          anchorDirection={anchorDirection}
        />
      </div>
      <div className={`flex-1 relative ${wrapClassName}`}>
        {renderInputCheckInDate()}
        {/* {renderInputCheckOutDate()} */}
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
