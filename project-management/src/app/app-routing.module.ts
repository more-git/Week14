import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectManagementComponent } from "./project-management/project-management.component";
import { TasksComponent } from "./tasks/tasks.component";
import {TaskComponent} from "./task/task.component";

const routes: Routes = [
  {path: 'project-management', component: ProjectManagementComponent},
  {path: 'project-management/tasks', component: TasksComponent},
  {path: 'project-management/task', component: TaskComponent},
  //{ path: 'project-management/task/:name', component: TaskComponent },
  {path : 'task', component: TaskComponent},
  { path: '**', component: TaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
