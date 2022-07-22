import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import {IHiddenProject, IResource,IResPlan,Resource,Result, Timescale, WorkUnits} from '../interfaces/res-plan-model'

import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap} from 'rxjs';
import { environment } from 'src/environments/environment';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { protectedResources } from '../auth-config';
import * as moment from 'moment';
import { LastYear } from '../common/utilities';


declare var $: any;

@Injectable()
export class UserStateService {
  baseUrl = protectedResources.todoListApi.endpoint;

  constructor(private http: HttpClient,private authService: MsalService) {

  }

  getCurrentUser():Observable<any> {
    let accounts = this.authService.instance.getAllAccounts();
    debugger;

    let userEmail = accounts[0].username; 

    return this.http.get<any>(environment.apiBaseUrl + "/ResourcePlanner/GetResources")
      .pipe(
        
      map(data =>{
        let resourceMatch = data.find((r:any)=>r.ResourceEmailAddress == userEmail );
        return {
          userName : userEmail,
          userId : resourceMatch.ResourceId
        }
      }
      ))
      }



  getWorkspaceResourcesForResourceManager(): Observable<Resource[]> {  //this should return Observable of IResource
   
    //  call getCurrentUserId()
    //  call /ResourcePlanner/GetWorkspaceState?managerId=59e5428a-7770-ea11-b0cb-00155db43b42'

    return this.getCurrentUser().pipe(
     mergeMap((user:any)=>{
      return this.http.get<any>(environment.apiBaseUrl + "/ResourcePlanner/GetWorkspaceState?managerId=" + user.userId).pipe(
        map(response=>{
          return response.result.assignedResources.map((data:any)=>{
return new Resource(data.resourceId,data.resourceName)
          }) 
        })
      )
    })
    );



   
  }
//  get existing workspace for logged in user
//  this is dataset 1
//  add a new resource to dataset 1
//  call the api with dataset 1

public AddResourceToManager(resMgr: any, resources: IResource[]): Observable<Result> {
  let resourcesForCurrentUser$:any = this.getWorkspaceResourcesForResourceManager().
  pipe(
    map((jsonData:any)=>{
     let resourcesForCurrentUserJson = jsonData.map((resource:any)=>{      
      return {"resourceId": resource.resUid,
     "resourceName": resource.resName,
     "hiddenProjects": [] 
    }
    });
     //for each new user added
     resources.forEach(resource=>{
      if(resourcesForCurrentUserJson.findIndex((r:any)=>r.resourceId.toUpperCase() == resource.resUid.toUpperCase()) < 0){
      resourcesForCurrentUserJson.push(
        {
          "resourceId": resource.resUid,
         "resourceName": resource.resName,
         "hiddenProjects": [] 

        }
      )
      }
      else{
        
        resourcesForCurrentUserJson.filter((r:any)=>r.resourceId.toUpperCase() == resource.resUid.toUpperCase())[0].hiddenProjects = resource.hiddenProjects;
      }
     })
    
     return resourcesForCurrentUserJson;
    })
  )
  ;

  

     return resourcesForCurrentUser$
     .pipe(
     mergeMap((newJsonData:any)=>{
      var data = {
        "managerId": resMgr.userId,
        "managerName": resMgr.userName,
        "assignedResources": newJsonData
      };
      return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/SetWorkspaceState", data)
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

public DeleteResourceFromManager(resMgr: any, resources: IResource[]): Observable<Result> {
  let resourcesForCurrentUser$:any = this.getWorkspaceResourcesForResourceManager().
  pipe(
    map((jsonData:any)=>{
     let resourcesForCurrentUserJson = jsonData.map((resource:any)=>{      
      return {"resourceId": resource.resUid,
     "resourceName": resource.resName,
     "hiddenProjects": [] 
    }
    });
     //for each user selected for delete
     resources.forEach(resource=>{
      resourcesForCurrentUserJson = resourcesForCurrentUserJson.filter((r:any)=>r.resourceId.toUpperCase() != resource.resUid.toUpperCase())
     })
    
     return resourcesForCurrentUserJson;
    })
  )
  ;

  

     return resourcesForCurrentUser$
     .pipe(
     mergeMap((newJsonData:any)=>{
      var data = {
        "managerId": resMgr.userId,
        "managerName": resMgr.userName,
        "assignedResources": newJsonData
      };
      return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/SetWorkspaceState", data)
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

HideResourcesOrProjects(resMgr: any, resPlans: IResPlan[]): Observable<Result> {
  //resPlans = resPlans.filter(r => r["selected"] == true)
  //1. get data from SP List UserState  
  return this.getWorkspaceResourcesForResourceManager().pipe(

      mergeMap((resources: Resource[]) => {

          let resourcesNotSelectedForHide = resources.filter(r => resPlans.filter(rp => rp['selected'] == false).map(rp => rp.resource.resUid.toUpperCase()).indexOf(r.resUid.toUpperCase()) > -1)
          //for every resource update hidden projects from form model
          resourcesNotSelectedForHide.forEach(resource => {
            debugger;
              //get resource plan from form model
              let resPlan = resPlans.filter(r => r.resource.resUid.toUpperCase() == resource.resUid.toUpperCase())[0];
              resource.hiddenProjects = resource.hiddenProjects.concat(resPlan.projects.filter(p => p["selected"] == true).map(h => {
                  let hiddenProject: IHiddenProject = {
                      projectUID: h.projUid,
                      projectName: h.projName
                  }
                  return hiddenProject;
              }))
          })

          return this.AddResourceToManager(resMgr,resourcesNotSelectedForHide)
      })
  )
}

// public deleteResourcesFromSharePointList(resMgrUid:string,resources : IResource[]){
//   let headers = new HttpHeaders();
//   headers = headers.set('accept', 'application/json;odata=verbose')
//   let options = {
//       withCredentials: true,
//       headers
//   }
//   let url = `${this.config.ResPlanUserStateUrl}/Items`
//   let filter = `?$filter=ResourceManagerUID eq '${resMgrUid}'`
//   //resPlans = resPlans.filter(r => r["selected"] == true)
//   //1. get data from SP List UserState  
//   return this.http.get(url + filter, options)

//       .flatMap((data: Response) => {
//           let existingResources = <IResource[]>JSON.parse(data["d"].results[0]["ResourceUID"]) //dev
//           let newResourceList = existingResources.filter(e=>resources.map(r=>r.resUid.toUpperCase()).indexOf(e.resUid.toUpperCase()) < 0);
//           return this.updateSharepointList(data["d"].results[0].__metadata.uri,newResourceList)
//       });
//               //
// }
// private updateSharepointList(url:string,resourcesNotSelectedForHide: IResource[]) {
//   return this.getRequestDigestToken().flatMap(digest => {
//       let headers = new HttpHeaders();
//       headers = headers.set('Accept', 'application/json;odata=verbose');
//       headers = headers.set('Content-Type', 'application/json;odata=verbose');
//       headers = headers.set('X-RequestDigest', digest);
//       let resourcesJSON = `'${JSON.stringify(resourcesNotSelectedForHide)}'`;
//       headers = headers.set('IF-MATCH', '*');
//       headers = headers.set('X-HTTP-Method', 'MERGE');
//       let options = {
//           headers: headers
//       };
//       let body = `{"__metadata": { "type": "SP.Data.ResourcePlanUserStateListItem" },"ResourceUID":${resourcesJSON}}"}`; //dev
//       let body = `{"__metadata": { "type": "SP.Data.ResourcePlanUserStateListItem" },"ResourceUID":${resourcesJSON}}"}` //qa
//       return this.http.post(url, body, options)
//           .map((response: Response) => {
//               var result = new Result();
//               result.success = true;
//               return result;
//           });
//   });
// }

UnHideResourceProjects(resMgrUid: string, resPlans: IResPlan[]): Observable<Result> {
  //1. get data from api  
  return this.getWorkspaceResourcesForResourceManager().pipe(

      mergeMap((data: Resource[]) => {
          let resources = data;
          //for every resource passed in as argument , unhide projects from projects found in each resPlan
          resources.forEach(resource => {
              //get resource plan from res Plan argument
              let resPlan = resPlans.filter(r => r.resource.resUid.toUpperCase() == resource.resUid.toUpperCase())[0];
              if (resPlan) { //if resource found in the input
                  resource.hiddenProjects = resource.hiddenProjects!.filter(r => resPlan.projects.map(p => p.projUid.toUpperCase())
                      .indexOf(r.projectUID.toUpperCase()) < 0)
              }
          })           

              //let body = `{"__metadata": { "type": "SP.Data.ResourcePlanUserStateListItem" },"ResourceUID":${resourcesJSON}}"}` //qa
              return this.AddResourceToManager(resMgrUid,resources as IResource[])
                  
          })
  )
}

  

}

