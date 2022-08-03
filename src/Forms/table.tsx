import {  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { isValidDate,currencyFormat,roundUpAll } from "./maternityCalculator";
export const OutputTable = ({earnings,validDate}:any): JSX.Element => {
    console.log("hello")
    console.log(validDate)
    const res = earnings as number
    if(earnings<123||!validDate as boolean)
        return <></>
    const rows = [
        {
            "label":"First 6 weeks",
            "earnings":0.9*res,
            "total":0.9*res*6
        },
        {
            "label":"Last 33 weeks",
            "earnings":Math.min(0.9*res,156.66),
            "total":Math.min(0.9*res,156.66)*33
        },
        {
            "label":"Total",
            "earnings":"NA",
            "total":Math.min(0.9*res,156.66)*33+0.9*res*6
        }


    ]

    return (

       <Box style={{width:"100%",borderRadius:"0px"}}>
        <TableContainer  component={Paper} style={{width:"50%",marginLeft:"0%",marginTop:"20px",borderRadius:"20px"}} >
        <Table size="small">
             <TableHead>
            <TableRow style={{width:'50%'}} >
            <TableCell  style={{fontWeight:"bold",fontSize:"x-small"}} align="left">Period</TableCell>
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">Consider Earnings</TableCell>
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">Total</TableCell>

            </TableRow>
             </TableHead>
             <TableBody>
             {rows.map((row,ind) => (
            <TableRow
            style={{width:'70%'}}
              sx={{ '&:last-child td, &:last-child th': { border: 0,backgroundColor:"#D3D3D3",fontWeight:"bold",fontSize:"small" } }}
            >

              <TableCell style={{}} align="left">{row.label }</TableCell>
              <TableCell style={{}} align="left">{row.earnings==="NA"?"NA":"£"+currencyFormat(roundUpAll(row.earnings as number)) }</TableCell>
              <TableCell style={{}} align="left">£{currencyFormat(roundUpAll(row.total))}</TableCell>

            </TableRow>
          ))}

             </TableBody>
             </Table>

        </TableContainer>
        </Box>

    )




}