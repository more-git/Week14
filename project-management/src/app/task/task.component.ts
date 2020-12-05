import { Component, OnInit } from '@angular/core';
import {TasksService} from "../_services/tasks.service";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {
  public newTask;
  public tasks;
  public projectId

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(returnTasks => {
      this.tasks = returnTasks.docss;
    })
  }

  saveTask(){
    this.tasksService.create(this.newTask, this.projectId).subscribe( saveTask => {
      this.tasks.push(saveTask);
    })
  }

}
