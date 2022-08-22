import { Box, IconButton,  Typography } from "@mui/material";
import { InputState,IconProps,payPeriodMapping } from "./variables";
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

 export  const formatDate = (formatDate: string): string => {
    const split = formatDate.split(" ")
    return split[1]+" "+split[0] +" "+split[2]


  };
const MyIcon = ({props}:any):JSX.Element=>{
    const data = props as boolean

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
    const [additionalInfo,setAdditionalInfo] = useState<boolean>(false)

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
    let latestDateToStartWorking = calculateDate(expectedDueDate-3600*1000*24*7*40,6)

    inputProps.icon=startDateValid && new Date(data.employmentStartDate).getTime()<=latestDateToStartWorking ? true : false
    inputProps.text=!startDateValid ? "Please insert a valid employment start date" : `${formatDate(new Date(latestDateToStartWorking).toString().substring(4,15))} `

    const qualifyingEnd = calculateDate(expectedDueDate-3600*1000*24*7*15,6)
    const qualifyingStart = calculateDate(qualifyingEnd-3600*1000*24*7*8,6)
    inputProps.qualifyingWeekStart = formatDate(new Date(qualifyingStart).toString().substring(4,15));
    inputProps.qualifyingWeekendEnd = formatDate(new Date(qualifyingEnd).toString().substring(4,15));


    //let day =
    } else {
        inputProps.text="Please insert a valid date expected due date"
        inputProps.validInput = false
    }
    const earnings = data.pay * payPeriodMapping[data.payPeriod as keyof typeof payPeriodMapping]

    const enoughEarnings = earnings>=123 ? true:false



    if(isValidDate(data.maternityStart)) {

    } else {
        inputProps.validInput=false
    }
    if(isValidDate(data.lastPaySlip)) {

    } else {
        inputProps.validInput=false
    }
        return (
        <Box>

    <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }}  style={hor}>
        <MyIcon props={inputProps.icon as boolean}>

        </MyIcon>
        <Typography style={marginLeft} >

         <b>Latest date to start working in order to qualify for SMP: </b>{inputProps.text}
        </Typography>
        </Box>
        <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <MyIcon props={enoughEarnings as boolean}>

        </MyIcon>
        <Typography style={marginLeft} >

         <b>Minimum earnings threshold: </b>{"The employee is earning £"+currencyFormat(roundUpAll(earnings)) +` per week which is ${enoughEarnings?"above":"below"} the minimum threshold of £123 per week`}
        </Typography>
        </Box>
    <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"30px",padding:"0px",borderRadius:"10px" ,display:"flex",flexDirection:"start",justifyContent:"flex-start"}}>

    <Box style={{}}>
    <Typography style={{color:"black",marginTop:"7px",marginLeft:"10px"}}> Payment schedule breakdown
    </Typography>
    </Box>
    <Box>
    <IconButton style={{transform:displayBreakdown && inputProps.validInput && enoughEarnings?"rotate(90deg)":"rotate(0deg)"}} onClick={(e)=>{
        setDisplayBreakdown(!displayBreakdown)

    }} >

    <ArrowForwardIcon/>

    </IconButton >
    {inputProps.validInput?"":"Please check your inputs to get a payment schedule breakdown"}
    </Box>
    </Box>
        <Fade in={displayBreakdown} unmountOnExit>
        <Box style={{marginLeft:"20px"}}>


        <OutputTable data={data} validInput={inputProps.validInput}/>
        </Box>
        </Fade>



    <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"30px",padding:"0px",borderRadius:"10px" ,display:"flex",flexDirection:"start",justifyContent:"flex-start"}}>

    <Box style={{}}>
    <Typography style={{color:"black",marginTop:"7px",marginLeft:"10px"}}>    Additional info
    </Typography>
    </Box>
    <Box>
    <IconButton style={{transform:additionalInfo?"rotate(90deg)":"rotate(0deg)"}} onClick={(e)=>{
        setAdditionalInfo(!additionalInfo)

    }} >

    <ArrowForwardIcon/>

    </IconButton >
    </Box>


    </Box>
        <Fade in={additionalInfo} unmountOnExit>
        <Box>
        <Box style={{marginLeft:"20px"}}>

        <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
         <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >
          {inputProps.validInput ? `The maternity pay period over which to calculate the average weekly earnings starts the ${inputProps.qualifyingWeekStart} and ends the ${inputProps.qualifyingWeekendEnd}`:"Check your inputs as we are not able to provide you with a maternity pay calculation period "}

         </Typography>
         </Box>
         <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >

          {inputProps.validInput ? `Deadline for employee to notifiy she wants to take maternity leave: ${formatDate(new Date(calculateDate(new Date(data.expectedDueDate).getTime()-dayMill*7*15,6)).toString().substring(4,15))}`:"Earliest date to go on maternity leave: Check your inputs as we are not able to provide you with a date"}

         </Typography>
        </Box>
        <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >
          {inputProps.validInput ? `Your employee must notify you by ${formatDate(new Date(new Date(data.maternityStart).getTime()-dayMill*28).toString().substring(4,15))} if she wants to start taking SMP on ${formatDate(new Date(data.maternityStart).toString().substring(4,15))}`:"Check your inputs as we are not able to provide you with a date for when your employee should notify you"}

         </Typography>
        </Box>
        <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >

          {inputProps.validInput ? `Earliest date to go on maternity leave: ${formatDate(new Date(calculateDate(new Date(data.expectedDueDate).getTime()-dayMill*7*12,0)).toString().substring(4,15))}`:"Earliest date to go on maternity leave: Check your inputs as we are not able to provide you with a date"}

         </Typography>
        </Box>
        <Box sx={{ boxShadow: 3,backgroundColor:"white",marginTop:"0px",padding:"10px",borderRadius:"10px" }} style={hor}>
        <InfoIcon >

         </InfoIcon>
         <Typography style={marginLeft} >

          {inputProps.validInput ? `Maternity leave automatic trigger if sick: ${formatDate(new Date(calculateDate(new Date(data.expectedDueDate).getTime()-dayMill*5*7,0)).toString().substring(4,15))}`:"Maternity leave automatic trigger if sick: Check your inputs as we are not able to provide you with a date"}

         </Typography>
        </Box>

         </Box>

    </Box>



        </Fade>
</Box>


    )

}