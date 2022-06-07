/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 李佳修
 * @Date: 2022-06-03 17:10:14
 * @LastEditTime: 2022-06-07 17:13:08
 * @LastEditors: 李佳修
 * @FilePath: /uwcssa_ca/src/admin/Activity/ActivityCreate/components/FormItems/Select.tsx
 */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import FieldLabel from '../FieldLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormType } from 'redux/form/formSlice';

interface SelectInfo {
    formSelectChoices?: string[];
    label?: string;
    isRequired?: boolean;
    description?: string;
    placeholder?: string;
    helperText?: string;
    [propName: string]: any
}

interface SelectProp {
    item: SelectInfo;
}

const Select: React.FC<SelectProp> = ({ item }) => {
  const [value, setValue] = useState<string | string[]>(item.formType === FormType.MultipleSelect ? [] : '');

  return (
    <>
      <FieldLabel name={item.question} isRequired={item.isRequired} description={item.description}/>
      <TextField
        label={item.label}
        select
        placeholder={item.placeholder}
        variant="outlined"
        fullWidth
        SelectProps={{
          multiple: item.formType === FormType.MultipleSelect
        }}
        size='small'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText={item.helperText}
      >
        {
          item.formSelectChoices?.map(choice => (
            <MenuItem value={choice} key={choice}>{choice}</MenuItem>
          ))
        }
      </TextField>
    </>
  );
};

export default Select;