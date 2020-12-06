import { Component, OnInit } from '@angular/core';
import {TasksService} from "../_services/tasks.service";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TimerService } from "../_services/timer.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
//import { Project } from "../_models/project.model";
import { Task } from "../_models/task.model";
import { interval } from 'rxjs';

import {switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  public newTask;
  public tasks;
  public projectId;
  public taskId;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private location: Location,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(returnTasks => {
      this.tasks = returnTasks.docs;
    })
  }

  saveTask(){
    this.tasksService.create(this.newTask, this.taskId).subscribe( saveTask => {
      if (saveTask) this.tasks.push(saveTask);
    })
  }

  startTask(task): void {
    console.log("start("+task.name+")");
    this.timerService.startTask(task.name);
  }

  stopTask(task): void {
    
    console.log("stop("+task.name+")");
    console.log("task_id = "+task.task_id);
    this.timerService.stopTask(task.name);

    this.timerService.updateTimer(task.name).subscribe(totalTime => {
      task.totalTime = totalTime;
    })

    /*this.timerService.updateTotalTime(task.task_id).subscribe(totalTime => {
      task.totalTime = totalTime;
    })*/

  }


}