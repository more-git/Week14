import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) {}

  getTasks(): Observable<any>{
    return this.httpClient.get<any>(`${environment.apiUrl}/names`);
  }

  createTask(){

  }


}
