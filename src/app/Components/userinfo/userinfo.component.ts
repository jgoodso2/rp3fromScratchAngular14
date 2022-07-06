import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { Project, Resource } from 'src/app/Interfaces/res-plan-model';
import { UserStateService } from 'src/app/Services/userState.service';
import { ProjectService } from 'src/app/Services/project.service';
import { ResourceService } from 'src/app/Services/resource.service';
import { TimehseetService } from 'src/app/Services/timehseet.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  loggedInUser = '';
  resUid = ''; 
  constructor(private userStateSvc: UserStateService,private _projSvc: ProjectService,private _resSvc:ResourceService,private _timesheetSvc:TimehseetService) { }

  ngOnInit(): void {
    // this.userStateSvc.AddResourceToManager("59e5428a-7770-ea11-b0cb-00155db43b42",
    //  [new Resource("BF9AE494-8F72-EA11-B0CD-00155D8C8B3A","Joe Colstad")]).subscribe(response=>console.log(response));
    //this._resSvc.getResources().subscribe((data:Resource[])=>console.log(data))
    this._resSvc.getResource("59e5428a-7770-ea11-b0cb-00155db43b42").subscribe((data:Resource)=>console.log(data))
    var start = new Date();
    start.setTime(start.getTime() - (1*60*60*1000));
    this._timesheetSvc.getTimesheetData("3fa85f64-5717-4562-b3fc-2c963f66afa6",start,new Date()).subscribe((data:any)=>console.log(data))
    
  }

}
