"use client";
import React from "react";

type CounterInputProps = {
  label: string;
  field: string;
  value: number;
  onChange: (newValue: number) => void;
};

const CounterInput: React.FC<CounterInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const decrease = () => onChange(Math.max(0, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <div className="px-3 mb-6">
      <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        {/* Decrease Button */}
        <div className="absolute inset-y-0 left-2 flex items-center z-10">
          <button
            type="button"
            onClick={decrease}
            className="w-4 h-4 sm:w-10 sm:h-10 bg-white text-blue-500 font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-xl shadow-md"
          >
            -
          </button>
        </div>

        {/* Value Input */}
        <input
          type="text"
          value={value}
          readOnly
          className="bg-gray-50 border border-gray-300 text-gray-700 text-sm text-center rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full px-12 py-2.5"
        />

        {/* Increase Button */}
        <div className="absolute inset-y-0 right-2 flex items-center z-10">
          <button
            type="button"
            onClick={increase}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-blue-500 font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-lg shadow-md"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterInput;
