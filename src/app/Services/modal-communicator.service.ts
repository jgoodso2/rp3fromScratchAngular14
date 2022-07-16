import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProject } from '../interfaces/res-plan-model';

@Injectable({
  providedIn: 'root'
})
export class ModalCommunicatorService {

  constructor() { }
 
  // Observable string sources
  public selectedProjects:IProject[];
  public projectsAssignedToResource = new Subject<IProject[]>();
  private modalSubmittedSource = new Subject<string>();
  private modalCancelledSource = new Subject<string>(); 
 
  // Observable string streams
  //projectIdArray$ = this.projectIdArraySource.asObservable();
  modalSubmitted$ = this.modalSubmittedSource.asObservable();
  modalCancelled$ = this.modalCancelledSource.asObservable();
  projectsAssignedToResource$ = this.projectsAssignedToResource.asObservable();
 projectsAssigned(projectsAssigned:IProject[])
 {
   this.projectsAssignedToResource.next(projectsAssigned);
 }
  
  modalSubmitClicked() {
    //; 
    this.modalSubmittedSource.next('');
  }

  modalCancelClicked() {
    
    this.modalCancelledSource.next('');
  }

  
}
