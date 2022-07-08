
import { Component } from '@angular/core';
    import {MatDatepickerInputEvent} from '@angular/material/datepicker';
    import { NavigationEnd, Router,ActivatedRoute,Params } from '@angular/router';
    import { AppStateService } from '../../services/app-state.service'
    import {FormControl, FormsModule} from '@angular/forms'

@Component({
selector: 'date-range-picker',
templateUrl: 'dateRangePicker.component.html',
styleUrls: ['dateRangePicker.component.css']
})

export class DateRangePicker  { 
    // startPicker:MatDatepicker;
    // end:MatDatepicker;
    events:  string[] = [];
    startingDate;
    endingDate;
    minDate;
    maxDate;
    endMinDate;
    endMaxDate;
    isValid: boolean = true;

    //this function determines whether a start date is valid. All dates are valid by default
    //this function is a built-in directive from angular material datepicker
    startDateValid = (startingDate:Date, endingDate: Date, minDate:Date): boolean => {
        // if(this.startingDate > this.endingDate) {
        //  return this.minDate = this.endingDate;
        // //    return false;
        // }
        return true;
    }

    endDateValid = (endMinDate: Date, startingDate:Date, endingDate:Date, minDate: Date): boolean => {
            if(this.startingDate > this.endingDate) {
            this.isValid = false;
            // return this.endMinDate = this.startingDate;
            // return this.endMinDate = this.minDate;
            // return this.endMinDate = this.minDate;
           
            return this.endMinDate = this.startingDate;
        }
        this.endMinDate = this.startingDate;
        this.isValid = true;
        return true;
    }

     startingDateSelector(event: MatDatepickerInputEvent<Date>) {
       this.startingDate = event.value;
       this.startDateValid(this.startingDate, this.endingDate, this.startingDate);
       return this.startingDate;
    }

      endingDateSelector(event: MatDatepickerInputEvent<Date>) {
      
        this.endingDate = event.value;
        this.endDateValid(this.startingDate,this.startingDate, this.endingDate, this.startingDate);
        return this.endingDate;
       }

       displayError(){
           return 'End Date cannot be earlier than Start Date';
       }

       resetDates (startingDate, endingDate){
        this.startingDate = '';
        this.endingDate = '';
       }

       GetstartingDate(s){
           s = this.startingDate;
           return s;
       }


    startDate:FormControl= new FormControl(this._appStateSvc.queryParams.fromDate.toISOString());
    endDate:FormControl= new FormControl(this._appStateSvc.queryParams.toDate.toISOString());
constructor(public router:Router,private _appStateSvc:AppStateService)
{

}

    SelectDates(start,end)
    {
       this.endDateValid(this._appStateSvc.queryParams.fromDate, this._appStateSvc.queryParams.fromDate, this._appStateSvc.queryParams.toDate,this._appStateSvc.queryParams.fromDate);
       this._appStateSvc.queryParams.fromDate = start;
       this._appStateSvc.queryParams.toDate = end;
       this.router.navigate(['home/resPlans',this._appStateSvc.queryParams]);
    }
}