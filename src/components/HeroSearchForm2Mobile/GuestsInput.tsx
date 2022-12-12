import React, { useEffect, useState } from "react";
import NcInputNumber from "components/NcInputNumber/NcInputNumber";
import { FC } from "react";

export interface GuestsObject {
  person?: number;
}
export interface GuestsInputProps {
  defaultValue: GuestsObject;
  onChange?: (data: GuestsObject) => void;
  className?: string;
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  className = "",
}) => {
  const [personInputValue, setpersonInputValue] = useState(
    defaultValue.person || 0
  );

  useEffect(() => {
    setpersonInputValue(defaultValue.person || 0);
  }, [defaultValue.person]);

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

  return (
    <div className={`flex flex-col relative p-5 ${className}`}>
      <span className="mb-5 block font-semibold text-xl sm:text-2xl">
        Who's coming?
      </span>
      <NcInputNumber
        className="w-full"
        defaultValue={personInputValue}
        onChange={(value) => handleChangeData(value, "person")}
        max={20}
        label="Adults"
        desc="Ages 13 or above"
      />
    </div>
  );
};

export default GuestsInput;
