import { Box, FormLabel, IconButton, Paper, Switch, Typography } from "@mui/material";
import { InputState } from "./variables";
import { isValidDate,currencyFormat,roundUpAll } from "./maternityCalculator";
import DoneIcon from '@mui/icons-material/Done';
import {OutputTable} from "./table"
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Fade} from "@mui/material"
const hor = {display:"flex",FlexDirection:"row",marginTop:"20px"}
const marginLeft={marginLeft:"5px"}
interface IconProps {
    icon:boolean;
    text:string;
    qualifyingWeekStart:string;
    qualifyingWeekendEnd:string;
    validInput:boolean;
    validStartDate:boolean
}
const payPeriodMapping = {
    "Annually":1/52,
    "Monthly":12/25,
    "Weekly":1,
    "Daily":7
}
export const parseMonth = {
    "0": "Jan",
    "1": "Feb",
    "2": "Mar",
    "3": "Apr",
    "4": "May",
    "5": "Jun",
    "6": "Jul",
    "7": "Aug",
    "8": "Sep",
    "9": "Oct",
    "10": "Nov",
    "11": "Dec",
  };
  const formatDate = (formatDate: string): string => {
    const split = formatDate.split("-").map(el => parseInt(el));

    if (isNaN(split[0]) || isNaN(split[1]) || isNaN(split[2])) return "  ";

    const monthIndex: string = (split[1] - 1).toString();

    return (
      split[2].toString() +
      " " +
      parseMonth[monthIndex as keyof Object] +
      " " +
      split[0].toString()
    );
  };
const MyIcon = ({props}:any):JSX.Element=>{
    const data = props as boolean
    console.log("d",data)
   if(data)
    return (
        <DoneIcon style={{color:"green"}} >

        </DoneIcon>
    )
    return (
        <DoNotDisturbIcon style={{color:"red"}}></DoNotDisturbIcon>
    )

}
const dayMill = 3600*1000*24

const calculateDate = (date:number,control:number)=>{
    let day = new Date(date).getDay()
    while(day!==control) {
        date+=dayMill
        day = new Date(date).getDay()

    }
    return date;
}
export const Output = ({props}:any):JSX.Element=>{
    const [displayBreakdown,setDisplayBreakdown] = useState<boolean>(false)

    const inputProps:IconProps = {
        icon:false,
        text:"",
        qualifyingWeekStart:"",
        qualifyingWeekendEnd:"",
        validInput:true,
        validStartDate:false
    }
    const data = props as InputState
    let startDateValid = false
    if(isValidDate(data.employmentStartDate)) {
        startDateValid=true
    } else {
        inputProps.validInput = false
    }
    if(isValidDate(data.expectedDueDate)) {
    const expectedDueDate = new Date(data.expectedDueDate).getTime()
    let latestDateToStartWorking = calculateDate(expectedDueDate-3600*1000*24*7*41,0)

    inputProps.icon=startDateValid && new Date(data.employmentStartDate).getTime()<=latestDateToStartWorking ? true : false
    inputProps.text=!startDateValid ? "Please insert a valid employment start date" : `${formatDate(new Date(latestDateToStartWorking).toISOString().substring(0,10))} `

    const qualifyingEnd = calculateDate(expectedDueDate-3600*1000*24*7*16,6)
    const qualifyingStart = calculateDate(qualifyingEnd-3600*1000*24*7*8,6)
    inputProps.qualifyingWeekStart = formatDate(new Date(qualifyingStart).toISOString().substring(0,10));
    inputProps.qualifyingWeekendEnd = formatDate(new Date(qualifyingEnd).toISOString().substring(0,10));


    //let day =
    } else {
        inputProps.text="Please insert a valid date expected due date"
        inputProps.validInput = false
    }
    const earnings = data.pay * payPeriodMapping[data.payPeriod as keyof typeof payPeriodMapping]

    const enoughEarnings = earnings>=123 ? true:false
    if(!enoughEarnings)
        inputProps.validInput = false

        const result = !enoughEarnings ? "Your employee is not earning at least £123 per week. She is not entitled to maternity leave" : !inputProps.validInput ? "Please check your inputs" : currencyFormat(roundUpAll(earnings*0.9*6 + Math.min(156.66,earnings*0.9)*33))

        return (
        <Box>
    <Box sx={{ boxShadow: 5,backgroundColor:"white",marginTop:"30px",padding:"10px",borderRadius:"10px" }}>

        Total maternity pay: <b>£{inputProps.validInput && !inputProps.icon ? "0.00" : !inputProps.validInput ? "Please check your inputs" : result}</b>




    </Box>
    <Box sx={{ boxShadow: 5,backgroundColor:"white",marginTop:"30px",padding:"0px",borderRadius:"10px" ,display:"flex",flexDirection:"start",justifyContent:"flex-start"}}>

    <Box style={{}}>
    <Typography style={{color:"black",marginTop:"7px",marginLeft:"10px"}}>    Additional info
    </Typography>
    </Box>
    <Box>
    <IconButton style={{transform:displayBreakdown?"rotate(90deg)":"rotate(0deg)"}} onClick={(e)=>{
        setDisplayBreakdown(!displayBreakdown)

    }} >

    <ArrowForwardIcon/>

    </IconButton >
    </Box>
    </Box>
        <Fade in={displayBreakdown} unmountOnExit>
        <Box style={{marginLeft:"20px"}}>

            <Box sx={{ boxShadow: 5,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
         <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >
          {inputProps.validInput ? `The maternity pay period over which to calculate the average weekly earnings starts the ${inputProps.qualifyingWeekStart} and ends the ${inputProps.qualifyingWeekendEnd}`:"Check your inputs as we are not able to provide you with a maternity pay calculation period "}

         </Typography>
         </Box>
        <Box sx={{ boxShadow: 5,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }}  style={hor}>
        <MyIcon props={inputProps.icon as boolean}>

        </MyIcon>
        <Typography style={marginLeft} >

         <b>Latest date to start working in order to qualify for SMP: </b>{inputProps.text}
        </Typography>
        </Box>

         <Box sx={{ boxShadow: 5,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <MyIcon props={enoughEarnings as boolean}>

        </MyIcon>
        <Typography style={marginLeft} >

         <b>Minimum earnings threshold: </b>{"The employee is earning £"+currencyFormat(roundUpAll(earnings)) +` per week which is ${enoughEarnings?"above":"below"} the minimum threshold of £123 per week`}
        </Typography>
        </Box>
        <OutputTable earnings={earnings} validDate={inputProps.icon}/>
        </Box>
        </Fade>


        </Box>

    )

}