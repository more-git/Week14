import { Component, OnInit } from '@angular/core';
import {TasksService} from "../_services/tasks.service";
//import { PubSubService } from '../_services/pubsub.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  public projectId;
  //public project;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(returnTasks => {
      this.tasks = returnTasks.docs;
    })

    this.projectId = this.route.snapshot.params['id'];

    console.log("projectId = "+ this.projectId);
    //if (this.projectId) {
    //        this.title = 'Edit Product';
    //        this.projectService.getById(this.projectId).subscribe(x => this.project = x);
    //    }
  }

  saveTask(){
    this.tasksService.create(this.newTask, this.projectId).subscribe( saveTask => {
      this.tasks.push(saveTask);
    })
  }

}
