"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";

interface InsuranceDetails {
  number_of_persons: number;
  budget_range: string;
  insurance_type: string;
  location: string;
}

interface InsuranceFormProps {
  event: { value: { insurance_details: InsuranceDetails } };
  resolve: (value: string) => void;
}

const InsuranceFormContainer = ({ theme, children }: { theme?: string; children: React.ReactNode }) => (
  <div data-testid="insurance-form" className="flex justify-center">
    <div
      className={`relative rounded-xl w-[700px] p-8 shadow-lg backdrop-blur-sm ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/50 shadow-2xl"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-gray-800 border border-gray-200/80"
      }`}
    >
      {children}
    </div>
  </div>
);

const FormHeader = ({ theme }: { theme?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
      Insurance Requirements
    </h2>
    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
      Please provide your insurance requirements so we can find the best options for you
    </p>
  </div>
);

const FormField = ({
  label,
  children,
  theme,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  theme?: string;
  required?: boolean;
}) => (
  <div className="mb-6">
    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder,
  theme,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  theme?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
      theme === "dark"
        ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
        : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  placeholder,
  theme,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  placeholder: string;
  theme?: string;
}) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value) || 1)}
    min={min}
    max={max}
    placeholder={placeholder}
    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
      theme === "dark"
        ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
        : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
  />
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  theme,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  theme?: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
      theme === "dark"
        ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
        : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
  />
);

const SubmitButton = ({
  onClick,
  disabled,
  theme,
}: {
  onClick: () => void;
  disabled: boolean;
  theme?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
      disabled
        ? "opacity-50 cursor-not-allowed bg-gray-400 text-gray-600"
        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
    }`}
  >
    <span className="text-lg mr-2">🔍</span>
    Get Insurance Recommendations
  </button>
);

const DecorativeElements = ({ theme }: { theme?: string }) => (
  <>
    <div
      className={`absolute top-4 right-4 w-20 h-20 rounded-full blur-xl ${
        theme === "dark"
          ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
          : "bg-gradient-to-br from-blue-200/30 to-purple-200/30"
      }`}
    />
    <div
      className={`absolute bottom-4 left-4 w-16 h-16 rounded-full blur-xl ${
        theme === "dark"
          ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          : "bg-gradient-to-br from-purple-200/30 to-pink-200/30"
      }`}
    />
  </>
);

export const InsuranceForm: React.FC<InsuranceFormProps> = ({ event, resolve }) => {
  const { theme } = useTheme();
  
  // Initialize form data from event or defaults
  const initialData = event.value?.insurance_details || {
    number_of_persons: 1,
    budget_range: "",
    insurance_type: "",
    location: "",
  };

  const [formData, setFormData] = useState<InsuranceDetails>(initialData);

  const insuranceTypes = [
    { value: "health", label: "Health Insurance" },
    { value: "life", label: "Life Insurance" },
    { value: "auto", label: "Auto Insurance" },
    { value: "home", label: "Home Insurance" },
    { value: "disability", label: "Disability Insurance" },
    { value: "travel", label: "Travel Insurance" },
    { value: "business", label: "Business Insurance" },
  ];

  const budgetRanges = [
    { value: "under-100", label: "Under $100/month" },
    { value: "100-300", label: "$100 - $300/month" },
    { value: "300-500", label: "$300 - $500/month" },
    { value: "500-1000", label: "$500 - $1,000/month" },
    { value: "over-1000", label: "Over $1,000/month" },
  ];

  const isFormValid = formData.number_of_persons > 0 && 
                     formData.budget_range && 
                     formData.insurance_type && 
                     formData.location.trim();

  const handleSubmit = () => {
    if (isFormValid) {
      const response = `I need insurance for ${formData.number_of_persons} person(s), with a budget of ${formData.budget_range}, for ${formData.insurance_type} insurance, located in ${formData.location}.`;
      resolve(response);
    }
  };

  return (
    <InsuranceFormContainer theme={theme}>
      <FormHeader theme={theme} />
      
      <div className="space-y-4">
        <FormField label="Number of Persons" theme={theme} required>
          <NumberInput
            value={formData.number_of_persons}
            onChange={(value) => setFormData(prev => ({ ...prev, number_of_persons: value }))}
            min={1}
            max={20}
            placeholder="Enter number of people to be covered"
            theme={theme}
          />
        </FormField>

        <FormField label="Budget Range" theme={theme} required>
          <SelectField
            value={formData.budget_range}
            onChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}
            options={budgetRanges}
            placeholder="Select your monthly budget range"
            theme={theme}
          />
        </FormField>

        <FormField label="Insurance Type" theme={theme} required>
          <SelectField
            value={formData.insurance_type}
            onChange={(value) => setFormData(prev => ({ ...prev, insurance_type: value }))}
            options={insuranceTypes}
            placeholder="Select type of insurance needed"
            theme={theme}
          />
        </FormField>

        <FormField label="Location" theme={theme} required>
          <TextInput
            value={formData.location}
            onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            placeholder="Enter your state or city"
            theme={theme}
          />
        </FormField>
      </div>

      <div className="mt-8">
        <SubmitButton
          onClick={handleSubmit}
          disabled={!isFormValid}
          theme={theme}
        />
      </div>

      <DecorativeElements theme={theme} />
    </InsuranceFormContainer>
  );
};
