export interface InputState {

    expectedDueDate:string;
    employmentStartDate:string;
    payPeriod:string;
    pay:number;
    maternityStart:string;
    lastPaySlip:string;
  }
 export interface OutputState {
    earliestLeave:string;
    earlieastLeaveifSick:string;

  }
  export interface IconProps {
    icon:boolean;
    text:string;
    qualifyingWeekStart:string;
    qualifyingWeekendEnd:string;
    validInput:boolean;
    validStartDate:boolean;

}
export const payPeriodMapping = {
    "Annually":1/52,
    "Monthly":12/52,
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