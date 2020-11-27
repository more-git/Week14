import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Project } from "../_models/project.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/names`)
  }

  create( newName ): Observable<Project> {
    return this.httpClient.post<any>(`${environment.apiUrl}/name`, {name: newName})
      .pipe(map(newName => new Project(newName.name)));
  }
 
  destroy( name ): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/name/${name._id}`)
  }

  removeProject( arrayNames, nameToRemove ): any{
    for (let i = 0; i <= arrayNames.length; i++) {
      if (arrayNames[i]._id === nameToRemove._id) {
        arrayNames.splice(i, 1);
        return arrayNames;
      }
    }
  }

  updateProject( nameToUpdate ): any{
    let options = { name: nameToUpdate.name, _id: nameToUpdate._id };
    return this.httpClient.request<any>('PUT', `${environment.apiUrl}/update/`, { body: options });
    //return this.httpClient.request<any>('PUT', `${environment.apiUrl}/update/${nameToUpdate._id}/${nameToUpdate.name}`);
  }

  editProject( arrayNames, nameToEdit ): any{
    for (let i = 0; i <= arrayNames.length; i++) {
      if (arrayNames[i]._id === nameToEdit._id) {
        arrayNames[i].name = nameToEdit.name;
        return arrayNames;
      }
    }
  }
}
