import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppUtilService } from 'src/app/common/app-util.service';
import { IInterval, Interval, IResPlan } from 'src/app/interfaces/res-plan-model';

@Component({
  selector: 'res-plan-header-row',
  templateUrl: './res-plan-header-row.component.html',
  styleUrls: ['./res-plan-header-row.component.css']
})
export class ResPlanHeaderRowComponent implements OnInit {

  visible: boolean = true;
  _resPlans: IResPlan[];
  _intervals: IInterval[];
  routeSub: Subscription;

  constructor(private router: Router, private _route: ActivatedRoute, private _appUtilSvc: AppUtilService) { }
  @Output() onselectAllChanged = new EventEmitter<boolean>();
  ngOnInit() {
    this._route.data.subscribe(values => {
      this._resPlans = values['resPlans'];
debugger;
      this.setIntervals(this._resPlans)
      //console.log('header component data=' + JSON.stringify(values.resPlans))
    }, (error) => console.log(error));
  }

  ngOnDestroy(){
    this._appUtilSvc.safeUnSubscribe(this.routeSub);
  }

  selectAllChange(value: boolean) {
    this.onselectAllChanged.emit(value);
  }

  public setIntervals(resPlans: IResPlan[]) {
    let projectWithIntervals:IInterval[] = []
    if(resPlans){
      for(var i=0;i<resPlans.length;i++)
      {
           if(resPlans[i].projects && resPlans[i].projects.length > 0 && resPlans[i].projects[0].intervals && resPlans[i].projects[0].intervals!.length > 0)
           {
            projectWithIntervals = resPlans[i].projects[0].intervals as IInterval[];
            break;
           }
      }
    }

 
      if (projectWithIntervals) {
        this._intervals = [];
        projectWithIntervals.forEach((interval:any) => {
          var intervalStart = moment(interval.intervalStart).toDate()
          var intervalEnd = moment(interval.intervalEnd).add(-1, 'days').toDate();
          this._intervals.push(new Interval('',interval.interval,intervalStart,intervalEnd))
        })

        //TODO how to break out of for loop when intervals already found
      }

    
  }

}
