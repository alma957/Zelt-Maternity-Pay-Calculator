import { Box, Typography } from "@mui/material";
import { InputState } from "./variables";
import { isValidDate,currencyFormat,roundUpAll } from "./maternityCalculator";
import DoneIcon from '@mui/icons-material/Done';
import {OutputTable} from "./table"
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import InfoIcon from '@mui/icons-material/Info';
const hor = {display:"flex",FlexDirection:"row",marginTop:"20px"}
const marginLeft={marginLeft:"5px"}
interface IconProps {
    icon:boolean;
    text:string;
    qualifyingWeekStart:string;
    qualifyingWeekendEnd:string
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
    const expectedDateProps:IconProps = {
        icon:false,
        text:"",
        qualifyingWeekStart:"",
        qualifyingWeekendEnd:""
    }
    const data = props as InputState
    let startDateValid = false
    if(isValidDate(data.employmentStartDate)) {
        startDateValid=true
    }   
    if(isValidDate(data.expectedDueDate)) {
    const expectedDueDate = new Date(data.expectedDueDate).getTime()
    let latestDateToStartWorking = calculateDate(expectedDueDate-3600*1000*24*7*41,0)
    
    
    expectedDateProps.icon=startDateValid && new Date(data.employmentStartDate).getTime()<=latestDateToStartWorking ? true : false
    expectedDateProps.text=!startDateValid ? "Please insert a valid employment start date" : `${formatDate(new Date(latestDateToStartWorking).toISOString().substring(0,10))} `
    
    const qualifyingEnd = calculateDate(expectedDueDate-3600*1000*24*7*16,6)
    const qualifyingStart = calculateDate(qualifyingEnd-3600*1000*24*7,6)
    expectedDateProps.qualifyingWeekStart = formatDate(new Date(qualifyingStart).toISOString().substring(0,10));
    expectedDateProps.qualifyingWeekendEnd = formatDate(new Date(qualifyingStart).toISOString().substring(0,10));

    
    //let day = 
    } else {
        expectedDateProps.text="Please insert a valid date expected due date"
    }
    const earnings = data.pay * payPeriodMapping[data.payPeriod as keyof typeof payPeriodMapping]

    const enoughEarnings = earnings>=123 ? true:false
    return (
        <Box>
            <Box style={hor}>
         <InfoIcon >
         
         </InfoIcon>
         <Typography style={marginLeft} >
          {expectedDateProps.qualifyingWeekStart!=="" && expectedDateProps.qualifyingWeekendEnd!=="" ? `The maternity pay period over which to calculate the average weekly earnings starts the ${expectedDateProps.qualifyingWeekStart} and ends the ${expectedDateProps.qualifyingWeekendEnd}`:"Check your inputs as we are not able to provide you with a maternity pay calculation period "}

         </Typography>
         </Box>
        <Box style={hor}>
        <MyIcon props={expectedDateProps.icon as boolean}>
        
        </MyIcon>
        <Typography style={marginLeft} >
      
         <b>Latest date to start working in order to qualify for SMP: </b>{expectedDateProps.text}
        </Typography>
        </Box>
         
         <Box style={hor}>
        <MyIcon props={enoughEarnings as boolean}>
        
        </MyIcon>
        <Typography style={marginLeft} >
      
         <b>Minimum earnings threshold: </b>{"The employee is earning £"+currencyFormat(roundUpAll(earnings)) +` which is ${enoughEarnings?"above":"below"} the minimum threshold of £123 per week`}
        </Typography>
        </Box>
        <OutputTable earnings={earnings} validDate={expectedDateProps.icon}/>
         </Box>
        
    )

}