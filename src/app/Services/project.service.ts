import { Injectable } from '@angular/core';
import { IProject, Project } from '../interfaces/res-plan-model';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = protectedResources.todoListApi.endpoint;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(environment.apiBaseUrl + "/BulkEdit/Projects")
          .pipe(
           map((response:any)=>{
            return response.map((data:any)=>{
            var project = new Project(data.ProjectId,data.projectName);
             project.projectChargeBackCategory = data["Project Chargeback Category"];
             return project;
            })
          })
           )

          
  }

}
