import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD:delete-edit-demo/src/app/app-routing.module.ts
import {NamesManagementComponent} from "./names-management/names-management.component";
import {TasksComponent} from "./tasks/tasks.component";

const routes: Routes = [
  {path: 'names-management', component: NamesManagementComponent},
  {path: 'tasks', component: TasksComponent}
=======
import { ProjectManagementComponent } from "./project-management/project-management.component";

const routes: Routes = [
  {path: 'project-management', component: ProjectManagementComponent}
>>>>>>> efbe409a392359449a4870e5a0e35693eee5e8d5:project-management/src/app/app-routing.module.ts
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
