import {useEffect, useState} from "react";

import {
  Select,
  TextField,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Typography,
  Box,
   Fade,
  FormLabel,
  Switch,
  FormGroup,
} from "@mui/material";

import "../App.css";
import { InputState } from "./variables";

import { Output } from "./output";
const errorStyle = {
  color: "red",
  background: "#F2F2F7",
  marginLeft: "0",
  marginTop: "0",
  width: "100%"
};

const labelStyle = {
  color: "black",fontWeight:"bold",fontSize:"95%"
}

const inputStyle = {background: "white",marginLeft:"0px",width:"100%"}
const inputSameRow = {display:"flex",FlexDirection:"row",justifyContent:"flex-start"}
 export const MaternityCalculator = ():JSX.Element=>{

  const [inputState,setInputState] = useState<InputState>({
    expectedDueDate:"2022-01-01",
    employmentStartDate:"2022-01-01",
    payPeriod:"Weekly",
    pay:500
  });


  return (
    <Paper
      className="myinput"
      style={{
        width: "80%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft: "20px",
        marginTop: "20px",
        background: "#F2F2F7",
      }}
    >
    <Box style={inputSameRow}>
      <TextField
        type="date"
        size="small"
        style={{...inputStyle}}
        label="Employment start date"
        InputLabelProps={{
          shrink: true,
          style: labelStyle,
        }}
        value={inputState?.employmentStartDate}
      //  value={inputState.date}
        onChange={e => {

          inputState!.employmentStartDate=e.target.value
          setInputState({...inputState})

        }}
        //error={ErrorInputState.date !== ""}
       helperText=""
        FormHelperTextProps={{
         style: errorStyle,
        }}
      />
      <TextField
        type="date"
        style={{...inputStyle,marginLeft:"20px"}}
        size="small"
        label="Expected due date"
        value={inputState?.expectedDueDate}
        InputLabelProps={{
          shrink: true,
          style: labelStyle,
        }}
      //  value={inputState.date}
        onChange={e => {
          inputState!.expectedDueDate=e.target.value
          setInputState({...inputState})
        }}
        helperText=""
        //error={ErrorInputState.date !== ""}
       // helperText={ErrorInputState.date}
        FormHelperTextProps={{
         style: errorStyle,
        }}
      />
      </Box>
     <Box style={{...inputSameRow,marginTop:"20px"}}>
        <FormControl style={{width:"100%"}}>
      <InputLabel size="small" style={{color: "black",fontWeight:"bold",fontSize:"95%"}} >
          Pay frequency
        </InputLabel>
        <Select
        size="small"
          label="Pay frequency"
          style={inputStyle}
          value={inputState?.payPeriod}
          defaultValue={"Annually"}
          input={<OutlinedInput label="Pay frequency" />}
          onChange={e => {
            inputState!.payPeriod=e.target.value
          setInputState({...inputState})
          }}
        >
          <MenuItem value="Annually">Annually</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
          <MenuItem value="Daily">Dailz</MenuItem>

        </Select>
        </FormControl>
          <Box style={{width:"100%",marginLeft:"20px"}}>
        <TextField
        size="small"
        type="number"
        style={{...inputStyle,width:"100%"}}
        inputProps={{min:0}}
        label="Earnings"
        value={inputState?.pay}
        InputLabelProps={{
          shrink: true,
          style: labelStyle,
        }}
      //  value={inputState.date}
        onChange={e => {
          inputState!.pay=parseFloat(e.target.value)
          setInputState({...inputState})
        }}
        //error={ErrorInputState.date !== ""}
       // helperText={ErrorInputState.date}
        FormHelperTextProps={{
         // style: errorStyle,
        }}

      />      </Box></Box>


<Output props={inputState} />



    </Paper>
  );
};
export const currencyFormat = (num: number): string => {

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const roundUpAll = (original: number): number => {
  const tempOr = original.toString();

  let value;
  if (tempOr.indexOf(".") === -1) return original;
  else {
    value = tempOr + "00";
  }
  let up = false;
  for (let i = value.indexOf(".") + 3; i < value.length; i++) {
    const d = value.charAt(i);
    if (d !== "0") {
      up = true;
      break;
    }
  }
  const digits = value.split(".")[1];
  if (up && digits[1] === "9" && digits[0] === "9") {
    return Math.round(original);
  } else if (up && digits[1] === "9") {
    return parseFloat(value.split(".")[0] + "." + (parseInt(digits[0]) + 1).toString());
  } else if (up) {
    return parseFloat(value.split(".")[0] +"." + digits[0] +  (parseInt(digits[1]) + 1).toString());
  } else {
    return original;
  }
};

export const isValidDate = (date: string): boolean => {
  return date !== "" && !isNaN(new Date(date).getTime());
};
