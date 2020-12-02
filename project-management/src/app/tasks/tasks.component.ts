import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../_services/projects.service";
import { TimerService } from "../_services/timer.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Project } from "../_models/project.model";
import { Task } from "../_models/task.model";
import { interval } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  public newProject;
  public projects;
  public editProject = new Project();
  public newTask;
  public tasks;
  newMessage: string;
  messageList: string[] = [];
  taskTime: string;
  task_id:string;
  timeMessage: string;
  //task_id: string;

  constructor(
  	private projectsService: ProjectsService,
    private modalService: NgbModal,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
  	this.projectsService.getAll().subscribe(returnProjects => {
      this.projects = returnProjects.docs;
    })

 }

 
 saveProject(): void {
    this.projectsService.create(this.newProject).subscribe( saveProject => {
      	this.projects.push(saveProject);
    })
  }

  //startTimer(task_id): void {
  startTimer(): void {
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    const subscription = secondsCounter.subscribe(n =>
      this.timeMessage = n.toString()
    );

    const minutesCounter = interval(60000);
    const sub = minutesCounter.subscribe(n =>
    console.log(`It's been ${n + 1} minutes since saving!`));

    this.task_id = '1234';//
    this.timerService.startTimer(this.task_id, "start");

  }

  //stopTimer(task_id): void {
  stopTimer(): void {
    this.timerService.sendMessage((this.timeMessage));
    this.messageList.push(this.timeMessage);
    this.taskTime = this.timeMessage;
    this.task_id = '1234';
    this.timerService.stopTimer(this.task_id);
  }


  deleteProject(projectToDelete): void {
    this.projectsService.destroy(projectToDelete).subscribe(success => {
      this.projects = this.projectsService.removeProject(this.projects, projectToDelete);
    }, error => {
      console.log(error);
    })
  }

  newEditProject(content, project): void {
    this.editProject = project;
    this.modalService.open(content).result.then((result) => {
      this.saveEditedProject(this.editProject);
    }, (reason) => {})
  }

  saveEditedProject(projectToEdit): void {
    this.projectsService.updateProject(projectToEdit).subscribe(success => {
      console.log("saveEditedProject: "+JSON.stringify(projectToEdit));
      this.projects = this.projectsService.editProject(this.projects, projectToEdit);
    }, error => {
      console.log(error);
    })

  }
}
