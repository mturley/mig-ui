import React, { useState } from 'react';
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectProps,
  Omit,
  SelectOptionProps,
} from '@patternfly/react-core';

export interface OptionWithValue<T = string> extends SelectOptionObject {
  value: T;
  props?: Partial<SelectOptionProps>; // Extra props for <SelectOption>, e.g. children, className
}

type OptionLike = string | SelectOptionObject | OptionWithValue;

export interface ISimpleSelectProps
  extends Omit<
    SelectProps,
    'onChange' | 'isExpanded' | 'onToggle' | 'onSelect' | 'selections' | 'value'
  > {
  onChange: (selection: OptionLike, event: any) => void;
  onBlur?: (event: any) => void;
  options: OptionLike[];
  value: OptionLike | OptionLike[];
}

const SimpleSelect: React.FunctionComponent<ISimpleSelectProps> = ({
  onChange,
  onBlur,
  options,
  value,
  placeholderText = 'Select...',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Select
      placeholderText={placeholderText}
      isExpanded={isExpanded}
      onToggle={setIsExpanded}
      onSelect={(event, selection: OptionLike) => {
        onChange(selection, event);
        setIsExpanded(false);
      }}
      onBlur={onBlur}
      selections={value}
      {...props}
    >
      {options.map((option) => (
        <SelectOption
          key={option.toString()}
          value={option}
          {...(typeof option === 'object' && (option as OptionWithValue).props)}
        />
      ))}
    </Select>
  );
};

export default SimpleSelect;
