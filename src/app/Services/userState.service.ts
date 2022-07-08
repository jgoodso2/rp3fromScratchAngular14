import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import {IResource,Resource,Result} from '../Interfaces/res-plan-model'

import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap} from 'rxjs';
import { environment } from 'src/environments/environment';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { protectedResources } from '../auth-config';


declare var $: any;

@Injectable()
export class UserStateService {
  baseUrl = protectedResources.todoListApi.endpoint;

  constructor(private http: HttpClient,private authService: MsalService) {

  }

  getCurrentUserId():Observable<string> {
    let accounts = this.authService.instance.getAllAccounts();

    let userEmail = accounts[0].username; 

    return this.http.get<any>(environment.apiBaseUrl + "/ResourcePlanner/GetResources")
      .pipe(
        
      map(data =>{
        let resourceMatch = data.find((r:any)=>r.ResourceEmailAddress == userEmail );
        return resourceMatch.ResourceId;
      }
      ))
      }



  getWorkspaceResourcesForResourceManager(): Observable<Resource[]> {  //this should return Observable of IResource
   
    //  call getCurrentUserId()
    //  call /ResourcePlanner/GetWorkspaceState?managerId=59e5428a-7770-ea11-b0cb-00155db43b42'

    return this.getCurrentUserId().pipe(
     mergeMap((userId:string)=>{
      return this.http.get<Resource[]>(environment.apiBaseUrl + "/ResourcePlanner/GetWorkspaceState?managerId=" + userId)
    })
    );



   
  }
//  get existing workspace for logged in user
//  this is dataset 1
//  add a new resource to dataset 1
//  call the api with dataset 1

public AddResourceToManager(resMgrUid: string, resources: Resource[]): Observable<Result> {
  let resourcesForCurrentUser$:any = this.getWorkspaceResourcesForResourceManager().
  pipe(
    map((jsonData:any)=>{
     let resourcesForCurrentUserJson = jsonData.result;
     //for each new user added
     resources.forEach(resource=>{
      if(resourcesForCurrentUserJson.assignedResources.findIndex((r:any)=>r.resourceId.toUpperCase() == resource.resUid.toUpperCase()) < 0){
      resourcesForCurrentUserJson.assignedResources.push(
        {
          "resourceId": resource.resUid,
         "resourceName": resource.resName,
         "hiddenProjects": [] 

        }
      )
      }
     })
    
     return resourcesForCurrentUserJson;
    })
  )
  ;

     return resourcesForCurrentUser$
     .pipe(
     mergeMap((newJsonData:any)=>{
      return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/SetWorkspaceState", newJsonData)
      .pipe
      (
        map(r => {
          let result = new Result();
          result.success = true;
          return result;
          
        })
        ,tap((newJsonData:any)=>console.log((newJsonData)))
      )
    })
     )
  
}

  

}

