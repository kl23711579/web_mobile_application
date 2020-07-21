import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const IndustrySelection = (props) => {

  const { handleOnChange, rowData } = props

  const useStyles = makeStyles({
    formcontrol: {
      marginTop: '15px',
      minWidth: 120
    }
  });
  const classes = useStyles();
  const [industry, setIndustry] = useState([1,2,3]);
  const [selectedValue, setSelectedValue] = useState("default");
  

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    handleOnChange(event.target.value);
  }

  useEffect(() => {
    if (rowData.length === 0) {
      setSelectedValue("default");
      handleOnChange("default");
    }
    setIndustry(() => {
      return Array.from(rowData, ele => ele.industry).filter((ele, index, arr) => arr.indexOf(ele) === index);
    });
  }, [rowData]);

  return (
    <FormControl variant="outlined" className={classes.formcontrol} >
      <InputLabel>
        Industry
      </InputLabel>
      <Select
        label="Industry"
        name="industies"
        value={selectedValue}
        onChange={handleChange}
        native
      >
        <option value="default" key="default" > All </option>
        {industry.map( (option, index) => <option key={index} value={option}>{option}</option> )}
      </Select>
    </FormControl>
  );
}

export default IndustrySelection;