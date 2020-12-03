import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectManagementComponent } from "./project-management/project-management.component";
import { TasksComponent } from "./tasks/tasks.component";
import {TaskComponent} from "./task/task.component";

const routes: Routes = [
  {path: 'project-management', component: ProjectManagementComponent},
  {path: 'project-management/tasks', component: TasksComponent},
  {path : 'task', component: TaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
