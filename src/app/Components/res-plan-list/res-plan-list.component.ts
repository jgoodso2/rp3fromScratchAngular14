import { Component, EventEmitter, Inject, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, of, Subscription } from 'rxjs';
import { AppUtilService } from 'src/app/common/app-util.service';
import { CellWorkUnitsPipe } from 'src/app/common/cell-work-units.pipe';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { IntervalPipe } from 'src/app/common/interval.pipe';
import { SimpleModalComponent } from 'src/app/common/simple-modal.component';
import { IInterval, IProject, IResource, IResPlan, Resource, ResPlan, Result, Timescale, WorkUnits } from 'src/app/interfaces/res-plan-model';
import { AppStateService } from 'src/app/services/app-state.service';
import { ModalCommunicatorService } from 'src/app/services/modal-communicator.service';
import { ResourceplannerService } from 'src/app/services/resourceplanner.service';
import { ResourcesModalCommunicatorService } from 'src/app/services/resources-modal-communicator.service';
import { UserStateService } from 'src/app/services/userState.service';
import { MenuService } from 'src/fw/services/menu.service';
import { ResPlanHeaderRowComponent } from '../res-plan-header-row/res-plan-header-row.component';

@Component({
  selector: 'app-res-plan-list',
  templateUrl: './res-plan-list.component.html',
  styleUrls: ['./res-plan-list.component.css']
})
export class ResPlanListComponent implements OnInit {
  @ViewChild('modalProjects', { static: false }) modalProjects: SimpleModalComponent;
  @ViewChild('modalResources', { static: false }) modalResources: SimpleModalComponent;
  @ViewChild('header', { static: false }) header: ResPlanHeaderRowComponent;
  mainForm: FormGroup;
    resPlanData: IResPlan[] = [];
    projData: IProject[];
    currentFormGroup: FormGroup;
    fromDate: Date;
    toDate: Date;
    timescale: Timescale;
    workunits: WorkUnits;
    errorMessage: string;
    _intervalCount: number = 0;
    resPlanUserState: IResPlan[];
    confirmDialogResult: string;
    showTimesheetData: boolean = false;

    formValueChangesSub: Subscription;
    valuesSavedSub: Subscription;
    resourceAddedSub: Subscription;
    resourceDeletedSub: Subscription;
    resourceHiddenSub: Subscription;
    resourceActualsShowHide: Subscription;
    appExitSub: Subscription;
    exportPrintSub: Subscription;
    exportExcelSub: Subscription;
    appExitToBISub: Subscription
    routeDataChangedSub: Subscription
    projModalSubmission: Subscription
    resModalSubmission: Subscription
    projModalEmit: Subscription
    resModalEmit: Subscription
    matDlgSub: Subscription
    resPlanGroupChangesSub: Subscription
    getCurrentUserSub: Subscription
    getResPlansFromResSub: Subscription
    addResToMgrSub: Subscription
    addProjectsSub: Subscription
    getResPlansFromProjectsSub: Subscription
    saveResPlansSub: Subscription
    delResPlansSub: Subscription

  

  get resPlans(): FormArray {  //this getter should return all instances.
    return <FormArray>this.mainForm.get('resPlans');
}

@Output() onLoading = new EventEmitter<boolean>();
loading = false

load(val: boolean) {
    this.onLoading.emit(true)
    this.loading = true
}


constructor(@Inject(FormBuilder) private  fb:FormBuilder
   , private _modalSvc: ModalCommunicatorService
    , private router: Router
    , private _resPlanUserStateSvc: ResourceplannerService
    ,private _stateService :UserStateService
    , private menuService: MenuService
    //, private _exportExcelService: ExportExcelService
    , private _resModalSvc: ResourcesModalCommunicatorService
    , public _appSvc: AppStateService
    , private _appUtilSvc: AppUtilService
    , private _route: ActivatedRoute
    , private dialog: MatDialog
    ) { }

ngOnInit(): void {
    this.mainForm = this.fb.group({
        resPlans: this.fb.array([])
    });
    // this.formValueChangesSub = this.mainForm.valueChanges.subscribe(t => {
    //     //app state service emit this.mainForm.dirty
    //     this._appSvc.setFormDirty(this.mainForm.dirty);
    // })

    this._appSvc.mainFormDirty = false;
    //this.valuesSavedSub = this._appSvc.save$.subscribe(() => this.savePlans(this.fromDate, this.toDate, this.timescale, this.workunits))
    this.resourceAddedSub = this._appSvc.addResources$.subscribe(() => this.addResources())
    this.resourceDeletedSub = this._appSvc.delete$.subscribe(() => this.openDeleteResPlanDialog())
    //this.resourceHiddenSub = this._appSvc.hide$.subscribe(() => this.deleteResPlans(this.fromDate, this.toDate, this.timescale, this.workunits, true))
    this.resourceActualsShowHide = this._appSvc.showActuals$.subscribe(() => this.toggleTimesheetDisplay())
    //this.appExitSub = this._appSvc.exitToPerview$.subscribe(() => { console.log(''); this.exitToPerView(this._appSvc.mainFormDirty) })

    //this.exportPrintSub = this._appSvc.printToPDF$.subscribe(() => { this.printFunction() });
    //this.exportExcelSub = this._appSvc.exportToExcel$.subscribe(() => { this.excelExportFunction() });

    //this.appExitToBISub = this._appSvc.exitToBI$.subscribe(() => this.exitToBI(this._appSvc.mainFormDirty))



    this.fromDate = this._appSvc.queryParams.fromDate
    this.toDate = this._appSvc.queryParams.toDate
    this.timescale = this._appSvc.queryParams.timescale
    this.workunits = this._appSvc.queryParams.workunits
    this.showTimesheetData = this._appSvc.queryParams.showTimesheetData;

    this.routeDataChangedSub = this._route.data.subscribe(values => {
      debugger;
        this.resPlanData = values["resPlans"];
        //this.resPlans = values.resPlans;
        if (values["resPlans"] && values["resPlans"].length > 0)
            this.setIntervalLength((values["resPlans"] as IResPlan[]).map((t:any) => t.projects).reduce((a:any, b:any) => a.concat(b)))
        this.buildResPlans(values["resPlans"] as IResPlan[]);
        debugger;
        //console.log(JSON.stringify(values.resPlans))
    }, (error) => console.log(error))

    console.log("=========multi subscribe")



    //this.modalResources.modalSubmitted$.subscribe(() => this._resModalSvc.modalSubmitClicked(), (error) => console.log(error));
    //this.modalProjects.modalSubmitted$.subscribe(() => this._modalSvc.modalSubmitClicked(), (error) => console.log(error));
    //what is this below??

}

ngAfterViewChecked(): void {
  //console.log('ng after view checke fired.')
  this.resModalEmit = this.modalResources.modalSubmitted$.subscribe(() => { this._resModalSvc.modalSubmitClicked() }, (error) => console.log(error));
  this.projModalEmit = this.modalProjects.modalSubmitted$.subscribe(() => { this._modalSvc.modalSubmitClicked() }, (error) => console.log(error));
}


calculateTotals(fg: FormGroup): void {

  var value = fg.value;

  if (value.readOnly == true)
      return
  for (var i = 0; i < value["totals"].length; i++) {
      var sum = 0;
      for (var j = 0; j < value["projects"].length; j++) {
          if (value["projects"][j]["intervals"].length < 1)
              continue;
          var val = parseFloat(value["projects"][j]["intervals"][i]["intervalValue"]);

          if (!val) {
              val = 0;
          }

          sum += val;

      }
      if (this._appSvc.queryParams.workunits == WorkUnits.FTE) {
          sum = sum / 100;
      }
      value["totals"][i]['intervalValue'] = new IntervalPipe().transform(sum.toString(), this.workunits) + this.getWorkUnitChar(this._appSvc.queryParams.workunits);

  }
  fg.patchValue({ totals: value["totals"] }, { emitEvent: false });
  //console.log('Totals... ' + JSON.stringify(value) + "      stop....")

}
calculateTimesheetTotals(fg: FormGroup): void {
debugger;
  let value = fg.value;
  //for each interval in the timesheet total row
  for (var i = 0; i < value["timesheetTotals"].length; i++) {
      var sum = 0;
      //sum up the timesheet data for each project for the interval column
      for (var j = 0; j < value["projects"].length; j++) {
          if (value["projects"][j]["timesheetData"].length < 1)
              continue;
          var val = parseFloat(value["projects"][j]["timesheetData"][i]["intervalValue"]);

          if (!val) {
              val = 0;
          }

          sum += val;

      }
      if (this._appSvc.queryParams.workunits == WorkUnits.FTE) {
          sum = sum / 100;
      }
      //update the sum for the column
      value["timesheetTotals"][i]['intervalValue'] = new IntervalPipe().transform(sum.toString(), this.workunits) + this.getWorkUnitChar(this._appSvc.queryParams.workunits);

  }
  fg.patchValue({ timesheetTotals: value["timesheetTotals"] }, { emitEvent: false });
  //console.log('Totals... ' + JSON.stringify(value) + "      stop....")

}
formatTimesheetTotals(value: string) {
  if (value && value.toUpperCase() != "NA") {
      if (this.workunits == WorkUnits.hours) {
          return parseFloat(value).toFixed(0);
      }
      else if (this.workunits == WorkUnits.days) {
          return parseFloat(value).toFixed(1);
      }
      else {
          return parseFloat(value).toFixed(0);
      }
  }
  return value;

}
getWorkUnitChar(workUnits: WorkUnits): string {
  switch (+(workUnits)) {
      case WorkUnits.days: return 'd';
      case WorkUnits.hours: return 'hrs';
      case WorkUnits.FTE: return '%';
      default: return '';
  }
}
checkTotal(val: string) {
  ;
  if (this._appSvc.queryParams.workunits == WorkUnits.FTE) {
      if (parseInt(val) > 100) {
          return "totalRed"
      }
      else return "totalGreen"
  }
  else return ""

}

buildResPlans(plans: IResPlan[]) {
  if (plans) {
      //let resPlansGrp :FormGroup[] = [];
      //console.log('add resources ==========================================' + JSON.stringify(plans));
      for (var i = 0; i < plans.length; i++) {
          var resPlan = this.buildResPlan(plans[i]);
          this.resPlans.push(resPlan);
      }
  }
  //this.resPlans.push.apply(resPlansGrp)
}

buildResPlan(_resplan: IResPlan): FormGroup {
  var _totals = this.fb.array([]);
  var _timesheetTotals = this.fb.array([]);
  var resPlanGroup = this.fb.group({
      resUid: _resplan.resource.resUid.toLowerCase(),
      resName: _resplan.resource.resName,
      totals: this.initTotals(_totals, _resplan.projects),
      timesheetTotals: this.initTotals(_timesheetTotals, _resplan.projects),
      projects: this.fb.array([]),
      selected: this.fb.control(false),
      HasAutoGeneratedProjects: this.fb.control(false)
  });
  if(_resplan && _resplan.projects &&_resplan.projects.length){
  for (var i = 0; i < _resplan.projects.length; i++) {
    if(_resplan && _resplan.projects && _resplan.projects[i]){
      var project = this.buildProject(_resplan.projects[i]);
      (resPlanGroup.get('projects') as FormArray).push(project)
    }
  }
  }

  this.calculateTotals(resPlanGroup);
  this.calculateTimesheetTotals(resPlanGroup);
  this.resPlanGroupChangesSub = resPlanGroup.valueChanges.subscribe(value => {
      this.calculateTotals(resPlanGroup);
      this.calculateTimesheetTotals(resPlanGroup);
  }, (error) => console.log(error));
  this.SetAutoGenerated(resPlanGroup);
  return resPlanGroup;
}

buildProject(_project: IProject) {
  let projectSUffix = "";
  if (_project.autoGenerated) {
      projectSUffix = "*";
  }
  var project = this.fb.group(
      {
          projUid: _project.projUid,
          projName: projectSUffix + _project.projName,
          readOnly: _project.readOnly,
          readOnlyReason: this.fb.control(_project.readOnlyReason),
          intervals: this.fb.array([]),
          timesheetData: this.fb.array([]),
          selected: this.fb.control(false),
          startDate: _project.startDate,
          finishDate: _project.finishDate,
          autoGenerated: _project.autoGenerated,
          error: _project.error
      });
      if(_project != null && _project.intervals){
  for (var i = 0; i < _project.intervals.length; i++) {
      var interval = this.buildInterval(_project.intervals[i]);
      (project.get('intervals') as FormArray).push(interval);
  }
}
  if (_project.timesheetData) {
      for (var i = 0; i < _project.timesheetData.length; i++) {
          var interval = this.buildtimesheetInterval(_project.timesheetData[i]);
          (project.get('timesheetData') as FormArray).push(interval);
      }
  }

  //_project.readOnly && project.disable({emitEvent:false})
  return project;
}

buildInterval(interval: IInterval): FormGroup {

  return this.fb.group({
      intervalName: interval.intervalName,
      //intervalValue:  new PercentPipe(new IntervalPipe().transform(interval.intervalValue, this.workunits)  ).transform(interval.intervalValue)
      intervalValue: [new CellWorkUnitsPipe().transform(new IntervalPipe().transform(interval.intervalValue, this.workunits), this.workunits),
      Validators.pattern(this.getIntervalValidationPattern())],
      intervalStart: interval.start,
      intervalEnd: interval.end

  });
}

getIntervalValidationPattern(): string {
  switch (+(this.workunits)) {
      case WorkUnits.FTE:
          return "^[0-9]+(%)?";
      case WorkUnits.hours:

          return "^[0-9]+(hrs)?";
      case WorkUnits.days:
          return "^[0-9]+([,.][0-9])?(d)?";
  }
  return "";
}

getIntervalValidationMessage(): string {
  switch (+(this.workunits)) {
      case WorkUnits.FTE:
      case WorkUnits.hours:
          return "'Please enter a numeric value'";
      case WorkUnits.days:
          return "'Please enter a numeric value or a decimal value with one decimal place'";
  }
  return ""

}


buildtimesheetInterval(interval: IInterval): FormGroup {
  return this.fb.group({
      intervalName: interval.intervalName,
      //intervalValue:  new PercentPipe(new IntervalPipe().transform(interval.intervalValue, this.workunits)  ).transform(interval.intervalValue)
      intervalValue: interval.intervalValue,
      intervalStart: interval.start,
      intervalEnd: interval.end

  });
}

initTotals(totals: FormArray, _projects: IProject[]): FormArray {
  if (totals.controls.length < 1) {

      var intervalLen = this.getIntervalLength();
      for (var i = 0; i < intervalLen; i++) {

          var total = this.fb.group({
              intervalName: '',
              intervalValue: new IntervalPipe().transform('0', this.workunits)
          });
          totals.push(total);
      }
  }
  return totals;
}

getIntervalLength() : number {
  //toDo... thinking about putting interval count in data service
  return this._intervalCount;
}

setIntervalLength(projects: IProject[]) {

  if (this._intervalCount < 1) {
    if(projects && projects.length){
      for (var j = 0; j < projects.length; j++) {
        if(projects && projects[j] && projects[j].intervals && projects[j].intervals?.length){
          this._intervalCount = projects[j].intervals?.length || 0;
          return;
        }
      }
    }
  }

}

private SetAutoGenerated(plan: FormGroup): void {
  let projectControls = plan.controls["projects"] as FormArray;
  let autogeneratedProjectsCount = 0;
  projectControls.controls.forEach(projectControl => {
      // if project is auto generated hceck if any children interval cell dirty
      if ((projectControl.value as IProject).autoGenerated) {
          let intervalCellControls = (projectControl as FormGroup).controls["intervals"] as FormArray;
          if (intervalCellControls.controls.find(c => c.dirty == true)) {
              (projectControl as FormGroup).controls["autoGenerated"].setValue(false, { emitEvent: false });
              (projectControl as FormGroup).controls["projName"].setValue((projectControl.value as IProject).projName.replace("*", ""), { emitEvent: false })
          }
          else {
              autogeneratedProjectsCount++;
          }
      }
  });
  plan.controls['HasAutoGeneratedProjects'].setValue(autogeneratedProjectsCount > 0, { emitEvent: false });
}

//TODO:Uncomment later
toggleSelectAll(value: boolean) {
  ;
  // this.resPlans.controls.forEach((_resPlan: FormGroup) => {
  //     _resPlan.controls['selected'].setValue(value, { emitEvent: false });
  //     (_resPlan.controls['projects'] as FormArray).controls.forEach(element => {
  //         (element as FormGroup).controls['selected'].setValue(value, { emitEvent: false })
  //     });
  // });
}
toggleResPlanSelection(_resPlan: FormGroup, selected: boolean) {

  _resPlan.controls['selected'].setValue(selected, { emitEvent: false });
  (_resPlan.controls['projects'] as FormArray).controls.forEach(element => {
      (element as FormGroup).controls['selected'].setValue(selected, { emitEvent: false })
  });
  this._appSvc.resourceOrProjectsSelected(this.AnyResPlanSelectedForDeleteOrHide());
  this._appSvc.resourceSelected(this.AnyResPlanSelectedForDeleteOrHide());
}
toggleProjectSelection(_resPlan: FormGroup, _proj: FormGroup, selected: boolean) {
  _proj.controls["selected"].setValue(selected, { emitEvent: false });
  this.DeselectGroupOnUncheck(_resPlan, _proj, selected)
}
DeselectGroupOnUncheck(_resPlan: FormGroup, _proj: FormGroup, value: boolean) {
  _proj.controls['selected'].setValue(value, { emitEvent: false });
  if (value == false) {
      _resPlan.controls['selected'].setValue(false, { emitEvent: false });
  }

  this._appSvc.resourceOrProjectsSelected(this.AnyResPlanSelectedForDeleteOrHide());
  this._appSvc.resourceSelected(this.AnyResPlanSelectedForDeleteOrHide());
}
AnyResPlanSelectedForDeleteOrHide(): boolean {
  let selected: boolean = false;
  this.resPlans.controls.forEach(resPlan => {
      if ((resPlan as FormGroup).controls['selected'].value == true) {
          selected = true;
      }
      ((resPlan as FormGroup).controls['projects'] as FormArray).controls.forEach(resPlan => {
          if ((resPlan as FormGroup).controls['selected'].value == true) {
              selected = true;
          }
      });
  });
  return selected;
}

AnyResPlanSelectedForHide(): boolean {
  let selected: boolean = false;
  this.resPlans.controls.forEach(resPlan => {
      if ((resPlan as FormGroup).controls['selected'].value == true) {
          selected = true;
      }
  });
  return selected;
}

getTimesheetButtonText() {

  if (this.showTimesheetData == true) {
      return 'Hide Timesheet Data';

  }

  else {
      return 'Show timesheet Data';
  }
}
selectText(element:any) {
  var myRegexp = /[0-9]*/g;
  if(element && element.value){
    var regExValue = myRegexp.exec(element.value);
    if(regExValue){
  element.setSelectionRange(0, regExValue.length); //index of where the number ends
    }
  }
}

//TODO:Uncomment later
intervalChanged(plan: FormGroup, input: any, ctrl: AbstractControl) {
  // this.SetAutoGenerated(plan);

  // if (!ctrl.errors) {
  //     if ((event.currentTarget as HTMLInputElement).value && (event.currentTarget as HTMLInputElement).value.trim() != '')
  //         (event.currentTarget as HTMLInputElement).value = new CellWorkUnitsPipe().transform((event.currentTarget as HTMLInputElement).value, this.workunits);
  // }

  // this._appSvc.setFormDirty(true);
}

toggleTimesheetDisplay() {


  this.router.routeReuseStrategy.shouldReuseRoute = function () { return false };
  this.router.isActive = function () { return false; }
  this.router.navigate(['/home/resPlans', this._appSvc.queryParams]);
}

addProject(_resPlan: FormGroup): void {
  //get IProjects[] array from current formgroup

  var data = _resPlan.value.resUid;
  this._modalSvc.projectsAssigned(_resPlan.value.projects);
  this.projModalSubmission = this._modalSvc.modalSubmitted$.subscribe(() => {
      this.addSelectedProjects(this.fromDate, this.toDate, this.timescale, this.workunits, this.showTimesheetData);
      this.projModalSubmission && this.projModalSubmission.unsubscribe();
  }, (error) => console.log(error))
  this.modalProjects.showModal(data);
  this.currentFormGroup = _resPlan;
}
addSelectedProjects(fromDate: Date, toDate: Date, timescale: Timescale, workunits: WorkUnits, showTimesheetData: boolean) {
   this._appSvc.loading(true);
   this.getCurrentUserSub = this._stateService.getCurrentUserId().subscribe(resMgr => {
      let resource = new Resource(this.currentFormGroup.value["resUid"],
          this.currentFormGroup.value["resName"]);
      this.addProjectsSub = this._resPlanUserStateSvc.addResourcePlanForProjects(this._modalSvc.selectedProjects, resource,
          fromDate, toDate, timescale, workunits)
          .subscribe(results => {
              //let projects = this._modalSvc.selectedProjects;
              this.updateErrors(results);
              this._modalSvc.selectedProjects = [];
              ;
              let successfullProjects = results.map(t => t.project);
              //projects.filter(p => results.findIndex(r => r.success == true && r.project.projUid.toUpperCase() == p.projUid.toUpperCase()) > -1)
              console.log("===added projects" + JSON.stringify(successfullProjects))
              if (successfullProjects.length > 0) {
                  this.getResPlansFromProjectsSub = this._resPlanUserStateSvc.getResourcePlans(resource.resUid, 
                       fromDate, toDate, timescale, workunits
                      ).subscribe((resPlans:any) => {
                          this.buildSelectedProjects(resPlans[0].projects)//.filter(r=>r.projUid.toUpperCase))
                          this.header && this.header.setIntervals(resPlans);
                          this.initTotals(this.currentFormGroup.get('totals') as FormArray, resPlans[0].projects)
                          this.calculateTotals(this.currentFormGroup);
                          this.updateErrors(results);

                      });

              }

              this._appSvc.loading(false);


          })
  }, (error) => { console.log(error); this._appSvc.loading(false); })
}

buildSelectedProjects(projects: IProject[]): void {
  this.setIntervalLength(projects)
  var intervalLength = this.getIntervalLength();
  for (var k = 0; k < projects.length; k++) {
      let project: IProject = projects[k];
      // project.intervals = [];
      // for (var i = 0; i < intervalLength; i++) {
      //     project.intervals.push(new Interval('', '0.0'));
      // }

      (this.currentFormGroup.controls['projects'] as FormArray).push(this.buildProject(project));
  }
}

addResources() {
  console.log("add resources fired");
  let resourcesSelected: IResource[] = this.resPlans.value.map((res:Resource) => { return new Resource(res.resUid, res.resName) })
  //console.log('resources selected=' + JSON.stringify(resourcesSelected))

  this._resModalSvc.ResourcesSelected(resourcesSelected)
  this.resModalSubmission = this._resModalSvc.modalSubmitted$.subscribe(() => {
      this.addSelectedResources()
      this.resModalSubmission && this.resModalSubmission.unsubscribe();
  }, (error) => console.log(error));
  this.modalResources.showModal('');
}

addSelectedResources() {
  //console.log("add resource fired" + JSON.stringify(this._resModalSvc.selectedResources));
  ///EMIT HERE
  let selectedResources = this._resModalSvc.selectedResources;
  this._appSvc.loading(true);
  this.getCurrentUserSub = this._stateService.getCurrentUserId().subscribe(resMgr => {

      console.log('selected resources=' + JSON.stringify(this._resModalSvc.selectedResources))
      this.getResPlansFromResSub = this._resPlanUserStateSvc.getResourcePlans(resMgr, this.fromDate, this.toDate, this.timescale, this.workunits)
          .subscribe(plans => {
              this.addResToMgrSub = this._stateService.AddResourceToManager(resMgr, this._resModalSvc.selectedResources).subscribe(r => {
                  if (r.success == true) {
                      console.log('added resplans=' + JSON.stringify(plans))
                      this.setIntervalLength((<ResPlan>plans).projects)
                      //filter resplan on the resource who got updated in SP list successfully
                      //let filteredPlans = plans.filter(p=>this._resModalSvc.selectedResources.map(s=>s.resUid).indexOf(p.resource.resUid) > -1)
                      this.buildResPlans([plans])
                      this._resModalSvc.selectedResources = [];
                      this._appSvc.loading(false);
                  }
                  else {
                      this._resModalSvc.selectedResources = [];
                      this._appSvc.loading(false);
                  }
              }, (error) => {
                  console.log(error); this._appSvc.loading(false);
              })
                  , (error:any) => { console.log(error); this._appSvc.loading(false); }
          })
  }, (error) => { console.log(error); this._appSvc.loading(false); })
}

updateErrors(errors: Result[]) {
  let resultsWithError = errors.filter(e => e.success == false);

  //reset errors to null before update
  this.resPlans.controls.forEach(resPlan => {
      (resPlan.get('projects') as FormArray).controls.forEach(project => {
          project.patchValue({ error: null })

      });
  });

  this.resPlans.controls.forEach(resPlan => {
      (resPlan.get('projects') as FormArray).controls.forEach(project => {
          if (resultsWithError && resultsWithError.length > 0 && resultsWithError.findIndex(e => e.project.projUid.toUpperCase() == project.get('projUid')!.value.toUpperCase()) > -1) {
              project.patchValue({ error: resultsWithError.find(e => e.project.projUid.toUpperCase() == project.get('projUid')!.value.toUpperCase())!.error })
          }

      });
  });
}

openDialog(data: any) // the second argument is a callback argument definition in typescript
        : MatDialogRef<any> {
        return this.dialog.open(ConfirmDialogComponent, {
            width: '250px',
            data: data
        });


    }
    
openDeleteResPlanDialog() {
  //if form is dirty
  if (this._appSvc.mainFormDirty) {
      let dialogRef = this.openDialog({
          title: "Can't Delete - Unsaved Changes On Page",
          content: "Click Cancel and then save your changes.   Click OK to erase all changes"
      });
      this.matDlgSub = dialogRef.afterClosed().subscribe(result => {
          this.confirmDialogResult = result;

          if (result == "yes") {

              this._appSvc.mainFormDirty = false;
              this.router.routeReuseStrategy.shouldReuseRoute = function () { return false };
              this.router.isActive = function () { return false; }
              this.router.navigate(['/home/resPlans', this._appSvc.queryParams]);
          }
      });
  }
  //if form is not dirty
  else {
      let dialogRef = this.openDialog({ title: "Are You Sure?", content: "This action will permanently delete resource plan assignments from the selected project(s)." })
      this.matDlgSub = dialogRef.afterClosed().subscribe(result => {
          this.confirmDialogResult = result;
          if (result == "yes")
              this.deleteResPlans(this.fromDate, this.toDate, this.timescale, this.workunits, false)
      });
  }



}

deleteResPlans(fromDate: Date, toDate: Date, timescale: Timescale, workunits: WorkUnits, hideOnly: boolean): void {
  if (this.mainForm.valid) {


      let resourceplans = this.fb.array(this.resPlans.controls)
          .controls
          .map(t => {
              var _resPlan: IResPlan;
              var _projects: IProject[]=[];
              var projects = Object.assign([], _projects, this.fb.array(((t as FormGroup).controls['projects'] as FormArray).controls.filter(s => s.value.selected == true)).value)
              let resPlan = new ResPlan();
              resPlan.resource = new Resource(t.value.resUid, t.value.resName);
              resPlan.projects = projects;
              resPlan.selected = (t as FormGroup).controls['selected'].value;
              console.log(JSON.stringify(resPlan))
              //resPlan["selected"] = _resPlan["selected"]
              return resPlan;
          });


      console.log("dirty resPlans" + JSON.stringify(resourceplans))
      this._appSvc.loading(true);
      // if (hideOnly == true) {
      //     this._appSvc.loading(true);
      //     this.getCurrentUserSub = this._stateService.getCurrentUserId().pipe(
      //     mergeMap(resMgr => {
      //         return this._resPlanUserStateSvc.HideResourcesOrProjects(resMgr, resourceplans).map(r => {
      //             if (r.success == true) {

      //                 this.deleteResourcePlans(resourceplans)
      //                 this._appSvc.loading(false);
      //             }
      //             else {
      //                 this._appSvc.loading(false);
      //             }
      //         },
      //             (error: any) => {
      //                 this.errorMessage = <any>error
      //                 this._appSvc.loading(false);
      //             }
      //         )
      //     },
      //         // (error: any) => {
      //         //     this.errorMessage = <any>error;
      //         //         this._appSvc.loading(false);
      //         //     }
      //     )).subscribe((r) => {
      //         this._appSvc.loading(false)

      //     }, () => { this._appSvc.loading(false) })
      // }
      // else {
      //     this.delResPlansSub = this._resPlanUserStateSvc.deleteResPlans(resourceplans, fromDate, toDate, timescale, workunits)
      //         .map(
      //             (results: Result[]) => {
      //                 this.updateErrors(results);
      //                 results.forEach(r => {
      //                     if (r.success == true) {
      //                         this.deleteResourcePlans(resourceplans)
      //                         this._appSvc.loading(false);
      //                     }
      //                     else {
      //                         this._appSvc.loading(false);
      //                     }
      //                 })

      //                 return results;

      //             }).subscribe(() => { this._appSvc.loading(false) }, () => { this._appSvc.loading(false) })
      // }
  }
  //()
  else if (!this._appSvc.mainFormDirty) {
      //this.onSaveComplete();
  }

}

deleteResourcePlans(resPlans: IResPlan[]) {
  resPlans.forEach(resPlan => {
      //entire res plan selected for delete
      if (resPlan.selected == true) {
          this.getCurrentUserSub = this._stateService.getCurrentUserId().subscribe(resMgr => {
              // this._appSvc.loading(true);
              // this._resPlanUserStateSvc.deleteResourcesFromSharePointList(resMgr, [resPlan.resource]).subscribe(result=>{
              //     if(result.success){
              //     let resPlanCtrlIndex = this.resPlans.controls.findIndex(t => ((t as FormGroup).controls['resUid'].value as string).toUpperCase() == resPlan.resource.resUid.toUpperCase());
              //     if (resPlanCtrlIndex > -1) {
              //         this.resPlans.removeAt(resPlanCtrlIndex);
              //     }
              //     this._appSvc.loading(false);
              // }
              // })
             
          });
      }
      // one or more projects selected to delete
      else {
          let deletedProjectUids = resPlan.projects.filter(p => p.selected == true).map(p => p.projUid.toUpperCase())
          let resPlanCtrl = this.resPlans.controls.find(t => ((t as FormGroup).controls['resUid'].value as string).toUpperCase() == resPlan.resource.resUid.toUpperCase()) as FormGroup;
          // let allProjects = resPlanCtrl.value['projects'];
          // let newProjects = allProjects.filter(a=> deletedProjectUids.indexOf(a["projUid"]) > -1);
          deletedProjectUids.forEach(deletedProject => {
              let index = (resPlanCtrl.controls['projects'] as FormArray).controls.findIndex(t => t.value.projUid.toUpperCase() == deletedProject.toUpperCase());
              if (index > -1) {
                  (resPlanCtrl.controls['projects'] as FormArray).removeAt(index);
              }
          })

      }
  });
}
}
