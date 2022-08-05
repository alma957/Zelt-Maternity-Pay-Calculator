import {  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { currencyFormat,roundUpAll } from "./maternityCalculator";
import { InputState, payPeriodMapping } from "./variables";
import { formatDate } from "./output";
interface Result{
    pay:number;
    date:string;
    adj:number;
}
export const OutputTable = ({data,validInput}:any): JSX.Element => {

    const state = data as InputState
    if(!validInput)
        return <></>
    const payPeriod = state.payPeriod
    const startDate = new Date(state.maternityStart).getTime()
    const dailyPay = state.pay * payPeriodMapping[payPeriod as keyof typeof payPeriodMapping]/7
    if(dailyPay*7<123)
        return <></>
    const lastPaySlip = new Date(state.lastPaySlip)
    const lastPayDay = lastPaySlip.getDay()
    const dayMill = 3600*1000*24

    let values:Array<Result>=[]

    const dailyMaternityPay = [...Array(7*39)].map((el,ind)=>{
        let p = null
        if(ind<42)
            p= 0.9*dailyPay
        else
        p= Math.min(156.66/7,0.9*dailyPay)
        return {"pay":p,"time":new Date(new Date(state.maternityStart).getTime()+dayMill*(ind+1)).getTime()}
    })

    let nextPayingDateMonthly = new Date(new Date(state.maternityStart).getFullYear(),new Date(state.maternityStart).getMonth()+1,new Date(lastPaySlip).getDate()).getTime()
    let sumTemp=0
    let prevDate =new Date(new Date(state.maternityStart).getFullYear(),new Date(state.maternityStart).getMonth(),new Date(lastPaySlip).getDate()).getTime()

    let daysInMaternity = 0;


    dailyMaternityPay.forEach((el,ind)=>

    {



        if(payPeriod==="Weekly") {
            sumTemp+=el.pay
            daysInMaternity++
            const day = new Date(startDate+dayMill*ind).getDay()



            if(ind===dailyMaternityPay.length-1){

                values.push({"date":new Date(startDate+dayMill*ind).toString().substring(0,10),"pay":sumTemp,"adj":(7-daysInMaternity)*dailyPay})
                daysInMaternity = 0

            }
            else if(day===lastPayDay) {

                values.push({"date":new Date(startDate+dayMill*(ind)).toString().substring(0,10),"pay":sumTemp,"adj":(7-daysInMaternity)*dailyPay})

                sumTemp=0
                daysInMaternity=0
            }


        } else {
            sumTemp+=el.pay
            daysInMaternity++
            if(ind===dailyMaternityPay.length-1) {
                const daysToWork = Math.round((nextPayingDateMonthly-prevDate)/(dayMill))


                values.push({"date":new Date(nextPayingDateMonthly).toString().substring(4,15),"pay":sumTemp,"adj":(daysToWork-daysInMaternity)*dailyPay})
                daysInMaternity=0
                sumTemp=0
            } else if(el.time>=nextPayingDateMonthly) {

                const daysToWork = Math.round((nextPayingDateMonthly-prevDate)/(dayMill))

                values.push({"date":new Date(nextPayingDateMonthly).toString().substring(4,15),"pay":sumTemp,"adj":(daysToWork-daysInMaternity)*dailyPay})
                sumTemp =0
                daysInMaternity=0
                prevDate = nextPayingDateMonthly
                nextPayingDateMonthly = new Date(new Date(nextPayingDateMonthly).getFullYear(),new Date(nextPayingDateMonthly).getMonth()+1,new Date(lastPaySlip).getDate()).getTime()

            }
        }
    })

    values[values.length-1].adj = 0
    values.push({"pay":dailyMaternityPay.reduce((a,b)=>a+b.pay,0),"date":"Total","adj":values.reduce((a,b)=>a+b.adj,0)})

    return (

       <Box style={{width:"100%",borderRadius:"0px"}}>
        <TableContainer  component={Paper} style={{width:"80%",marginLeft:"0%",marginTop:"20px",borderRadius:"0px"}} >
        <Table size="small">
             <TableHead>
            <TableRow style={{width:'50%',border: 0,backgroundColor:"#D3D3D3",fontWeight:"bold",fontSize:"x-small"}} >
            <TableCell  style={{fontWeight:"bold",fontSize:"small",}} align="left">Date</TableCell>
            <TableCell style={{fontWeight:"bold",fontSize:"small"}} align="left">Maternity pay</TableCell>
            <TableCell style={{fontWeight:"bold",fontSize:"small"}} align="left">Full pay</TableCell>
            <TableCell style={{fontWeight:"bold",fontSize:"small"}} align="left">Total</TableCell>


            </TableRow>
             </TableHead>
             <TableBody>
             {(values as Array<Result>).map((row) => (
            <TableRow
            style={{width:'70%'}}
              sx={{ '&:last-child td, &:last-child th': { border: 0,backgroundColor:"#D3D3D3",fontWeight:"bold",fontSize:"small" } }}
            >

              <TableCell style={{}} align="left">{row.date==="Total"?"Total":formatDate(row.date).split(" ").reduce((a,b)=>{

                if(b.length===1)
                    return "0"+b
            return a+" "+b
        },""
            )

            }</TableCell>
              <TableCell style={{}} align="left">£{currencyFormat(roundUpAll(row.pay))}</TableCell>
              <TableCell style={{}} align="left">£{currencyFormat(roundUpAll(row.adj))}</TableCell>
              <TableCell style={{}} align="left">£{currencyFormat(roundUpAll(row.adj+row.pay))}</TableCell>


            </TableRow>
          ))}

             </TableBody>
             </Table>

        </TableContainer>
        </Box>

    )




}
