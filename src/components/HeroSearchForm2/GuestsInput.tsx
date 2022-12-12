import React, { useEffect, useState } from "react";
import NcInputNumber from "components/NcInputNumber/NcInputNumber";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import ButtonSubmit from "./ButtonSubmit";
import useOutsideAlerter from "hooks/useOutsideAlerter";
import { PathName } from "routers/types";
import { GuestsObject } from "components/HeroSearchForm2Mobile/GuestsInput";

export interface GuestsInputProps {
  defaultValue: GuestsObject;
  onChange?: (data: GuestsObject) => void;
  className?: string;
  fieldClassName?: string;
  autoFocus?: boolean;
  submitLink: PathName;
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  fieldClassName = "[ nc-hero-field-padding--small ]",
  className = "",
  autoFocus = false,
  submitLink,
}) => {
  const refContainer = React.createRef<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(false);
  useOutsideAlerter(refContainer, () => setIsOpen(false));

  const [personInputValue, setpersonInputValue] = useState(
    defaultValue.person || 0
  );
  //

  useEffect(() => {
    setIsOpen(autoFocus);
  }, [autoFocus]);

  useEffect(() => {
    setpersonInputValue(defaultValue.person || 0);
  }, [defaultValue]);

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    let newValue = {
      person: personInputValue,
    };
    if (type === "person") {
      setpersonInputValue(value);
      newValue.person = value;
    }
    onChange && onChange(newValue);
  };

  const totalGuests = personInputValue;

  return (
    <div className={`flex relative ${className}`} ref={refContainer}>
      <div
        className={`flex flex-1 text-left justify-between items-center focus:outline-none cursor-pointer ${
          isOpen ? "nc-hero-field-focused--2" : ""
        }`}
      >
        <div
          className={`${fieldClassName} flex-1`}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <div className="flex-1 text-left">
            <span className="block font-semibold">
              {totalGuests || ""} Guests
            </span>
            <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
              {totalGuests ? "Guests" : "Add guests"}
            </span>
          </div>
        </div>
        <div className="relative">
          {!!totalGuests && isOpen && (
            <ClearDataButton
              onClick={() => {
                setpersonInputValue(0);
              }}
            />
          )}
        </div>
        <div className="pr-2">
          <ButtonSubmit href={submitLink} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-30 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
          <NcInputNumber
            className="w-full"
            defaultValue={personInputValue}
            onChange={(value) => handleChangeData(value, "person")}
            max={10}
            min={1}
            label="Adults"
            desc="Ages 13 or above"
          />
        </div>
      )}
    </div>
  );
};

export default GuestsInput;
