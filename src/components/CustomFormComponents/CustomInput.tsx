import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";

interface CustomInputProps<T extends FieldValues> {
  type?: string;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

function CustomInput<T extends FieldValues>({
  type,
  name,
  label,
  disabled,
  required,
  placeholder,
  className,
}: CustomInputProps<T>): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const typeToShow = showPassword ? "text" : "password";

  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  useEffect(() => {
    if (type === "number") {
      const inputElement = document.getElementById(name as string);
      if (inputElement) {
        inputElement.addEventListener("wheel", (e) => e.preventDefault(), {
          passive: false,
        });
      }
    }
  }, [name, type]);

  const hasError = !!errors?.[name];

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ 
          required: required ? "This field is required" : false,
          ...(type === "email" && {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })
        }}
        render={({ field }) => (
          <div className={`relative ${className || ""}`}>
            {label && (
              <label htmlFor={name as string} className="text-lg font-semibold">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            {/* Use value from field */}
            <Input
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = type === "number" ? (e.target.value ? parseFloat(e.target.value) : undefined) : e.target.value;
                field.onChange(value);
              }}
              type={type === "password" ? typeToShow : type}
              id={name as string}
              className={`w-full ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder={placeholder}
              disabled={disabled}
              min={type === "number" ? 0 : undefined}
              step={type === "number" ? 0.01 : undefined} // Allow decimal points
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
            {hasError && (
              <small className="block mt-1 text-sm text-red-500">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default CustomInput;
