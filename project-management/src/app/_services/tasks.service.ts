import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import { Task } from "../_models/task.model";


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) {}


  getTasks(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/tasks`);

  }

  //getTasks(id): Observable<any>{
    //return this.httpClient.get<any>(`${environment.apiUrl}/tasks/${id}`);
  //}

  create(newTask, projectId){
    return this.httpClient.post<any>(`${environment.apiUrl}/task`, {name: newTask, project_id: projectId})
  }

  getTaskID(name): Observable<any>{
   	return this.httpClient.get<any>(`${environment.apiUrl}/tasks`);
  }

  //getProjectId(task_id): Observable<any>{
  // 	return this.httpClient.get<any>(`${environment.apiUrl}/proj`);
  //}



  displayProjectTasks( arrayTasks, projectIdToKeep ): any{
    var arrayProjectTasks;
    var len = arrayTasks.length;
    //alert(len + "   " +arrayTasks[0].project_id + "   " + arrayTasks[1].project_id + "   " + projectIdToKeep);
    for (let i = 0; i <= arrayTasks.length; i++) {
      if (!(arrayTasks[i].project_id === projectIdToKeep)) {
        arrayTasks.splice(i, 1);
        i--;
      }
    }
    return arrayTasks;


  }

  destroy(task): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/task/${task._id}`);
  }

  removeTasks(arrayNames, nameToRemove): any {
    for (let i = 0; i <= arrayNames.length; i++) {
      if (arrayNames[i]._id === nameToRemove._id) {
        arrayNames.splice(i, 1);
        return arrayNames;
      }
    }
  }

}

