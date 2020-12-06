import { Component, OnInit, Input } from '@angular/core';
import {TasksService} from "../_services/tasks.service";
import {ProjectsService} from "../_services/projects.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  public newTask;
  public tasks;
  public projectId ;

  @Input() childMessage: string;

  constructor(
    private tasksService: TasksService,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.projectId = this.projectsService.getId();

    this.tasksService.getTasks(this.projectId).subscribe(returnTasks => {
      this.tasks = returnTasks.docss;

    })

    //this.tasksService.getTasks(this.tasks, this.projectId).subscribe(returnTasks => {
      //this.tasks = returnTasks.docss;

   // })
  }

  saveTask(){
    this.tasksService.create(this.newTask, this.projectId).subscribe( saveTask => {
      this.tasks.push(saveTask);
    })
  }

  deleteTask(taskToDelete): void {
    this.projectsService.destroy(taskToDelete).subscribe(success => {
      this.tasks = this.projectsService.removeProject(this.tasks, taskToDelete);
    }, error => {
      console.log(error);
    })
  }



}
