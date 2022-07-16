import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtilService } from 'src/app/common/app-util.service';
import { IResource } from 'src/app/interfaces/res-plan-model';
import { AppStateService } from 'src/app/services/app-state.service';
import { ResourceService } from 'src/app/services/resource.service';
import { ResourcesModalCommunicatorService } from 'src/app/services/resources-modal-communicator.service';
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "resUid",
    "resName",
    "timesheetMgr"
  ];
  resData: IResource[];
  selectedResources: IResource[] = [];
  getResourcesSub:Subscription
  resourcesSelectedSub:Subscription
  mdlSubmitSub:Subscription
  resourceList: IResource[];
  dataSource = new MatTableDataSource<IResource>();
  data:IResource[];
  selection = new SelectionModel<IResource>(true, []);
  

  constructor(private fb: FormBuilder, private _resSvc: ResourceService, 
    private _modalResSvc: ResourcesModalCommunicatorService,private _appSvc:AppStateService,private _apputilSvc:AppUtilService) { 
    
  }

  ngOnInit() {
    //
    this.resourcesSelectedSub  = this._modalResSvc.ResourcesSelected$.subscribe((resourcesPicked: IResource[]) => {
      this._appSvc.loading(true);
     this.getResourcesSub =this._resSvc.getResources().subscribe(resources => {
        this.resData = resources
        let filteredResources = this.resData.filter(val => {
       
       if(resourcesPicked.map(t=>t.resName!.toUpperCase()).indexOf(val.resName!.toUpperCase())< 0)
       return val;
       return null;
     }) 
        console.log('filtered resources to pick=' + filteredResources.map(t => t.resUid).toString())
        this.resourceList = filteredResources;
        this.data = this.resourceList;
        this.data =this.resourceList;
        this.dataSource.data = this.data;
        this._appSvc.loading(false);
      },(error)=>console.log(error))
    },(error)=>{ console.log(error);this._appSvc.loading(false);})

   this.mdlSubmitSub = this._modalResSvc.modalSubmitted$.subscribe(success => this.clear(),
            error => console.log('error'));
  }


     rowClick(event:any) {
       this.selectResource(event.data.resUid);
    }

  clear() {
    //this._modalResSvc.selectedResources = [];
    this.selectedResources = [];
  }

  selectHandler(row: IResource) {
    this.selection.toggle(row);
    this.selectResource(row.resUid);
  }

  selectResource(id: string) {
    //;
    //uncheck use case
    if (this.selectedResources.map(t=>t.resUid).indexOf(id) > -1) {
      this.selectedResources.splice(this.selectedResources.map(t=>t.resUid).indexOf(id),1)
   }
    else {
      this.selectedResources.push(this.resData.filter(t => t.resUid == id)[0]);
    }
    this._modalResSvc.selectedResources = this.selectedResources;

  }

  ngOnDestroy()
  {
    this._apputilSvc.safeUnSubscribe(this.getResourcesSub)
    this._apputilSvc.safeUnSubscribe(this.resourcesSelectedSub)
    this._apputilSvc.safeUnSubscribe(this.mdlSubmitSub)
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
