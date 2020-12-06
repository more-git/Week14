import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) {}

  getTasks(projectId): Observable<any>{
    return this.httpClient.get<any>(`${environment.apiUrl}/tasks/${projectId}`);
    //this.displayProjectTasks(tasks, projectId);
  }

  create(newTask, projectId){
    return this.httpClient.post<any>(`${environment.apiUrl}/task`, {name: newTask, project_id: projectId})
  }

  displayProjectTasks( arrayTasks, taskIdToKeep ): any{
    var arrayProjectTasks;
    for (let i = 0; i <= arrayTasks.length; i++) {
      if (arrayTasks[i]._id === taskIdToKeep) {
        arrayProjectTasks = arrayTasks.splice(i, 1);
        return arrayProjectTasks;
      }
    }
  }

  destroy(name): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/task/${name._id}`);
  }

  removeProject(arrayNames, nameToRemove): any {
    for (let i = 0; i <= arrayNames.length; i++) {
      if (arrayNames[i]._id === nameToRemove._id) {
        arrayNames.splice(i, 1);
        return arrayNames;
      }
    }
  }


}
