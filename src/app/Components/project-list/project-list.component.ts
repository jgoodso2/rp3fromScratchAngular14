import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from '@angular/material/table';
import { IProject, Project } from 'src/app/interfaces/res-plan-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalCommunicatorService } from 'src/app/services/modal-communicator.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() projData: IProject[];
  selectedProjects: IProject[] = [];
  @Input() resPlan: FormGroup
  displayedColumns: string[] = [
    "select",
    "projUid",
    "projName",
    "owner"
  ];
  getProjectsSub:Subscription
  projectsAssngdToResSub:Subscription
  mdlSubmitSub:Subscription
  projectList :IProject[]=[];
  dataSource = new MatTableDataSource<IProject>();
  data:IProject[];
  selection = new SelectionModel<IProject>(true, []);
  constructor(private fb: FormBuilder, private _modalSvc: ModalCommunicatorService, private _projSvc: ProjectService
    ,private _appSvc:AppStateService  ) { }
  ngOnInit(): void {
    
    console.log('project list component created'); 

   this.projectsAssngdToResSub = this._modalSvc.projectsAssignedToResource$.subscribe((projectsInRP: IProject[]) => {
      this._appSvc.loading(true);
    this.getProjectsSub = this._projSvc.getProjects().subscribe(projects => {

        this.projData = projects
        
        console.log('OBSERVABLE FIRED ON PROJECT LIST')
        let filteredProjects = this.projData.filter(val => {
          if (projectsInRP.map(t => t.projUid.toUpperCase()).indexOf(val.projUid.toUpperCase()) < 0)
            return val;
            return null;
        }, (error:any) => console.log(error))
        //console.log('all projects in RP=' + projectsInRP.map(t => t.projUid).toString())
        //console.log('projects to show on modal=' + filteredProjects.map(t => t.projUid).toString())
        this.projectList = filteredProjects;
        this.data =filteredProjects;
        this.dataSource.data = this.data;
        this._appSvc.loading(false);
      })

    }, (error) => {console.log(error);this._appSvc.loading(false);})
    this.mdlSubmitSub = this._modalSvc.modalSubmitted$.subscribe(success => this.clear(),
      error => console.log('error'));
  }

  selectHandler(row: IProject) {
    this.selection.toggle(row);
    this.selectProject(row.projUid);
  }

  selectProject(id: string) {
    //;
    //uncheck use case
   
    if (this.selectedProjects.map(t=>t.projUid).indexOf(id) > -1) {
       this.selectedProjects.splice(this.selectedProjects.map(t=>t.projUid).indexOf(id),1)
    }
    else {
      this.selectedProjects.push(this.projData.filter(t => t.projUid == id)[0]);
    }
    this._modalSvc.selectedProjects = this.selectedProjects;

  }

  onChange(typeValue: number) {
    this.selection.clear();
  }
  clear() {
    //this._modalSvc.selectedProjects = [];
    this.selectedProjects = [];
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}



