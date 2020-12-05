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
  //timers: string[] = [];

  constructor(
  	private projectsService: ProjectsService,
    private modalService: NgbModal,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
  	this.projectsService.getAll().subscribe(returnProjects => {
      this.projects = returnProjects.docs;
    })

    this.timerService.getTimers().subscribe(returnTimers => {
      console.log("timerService.getTimers(): returnTimers.docs = "+returnTimers.docs.toString());
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

  //startTimer(task_id): void {
  start(project): void {

    this.timerService.start(project.name);

    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    const subscription = secondsCounter.subscribe(n =>
      this.timeMessage = n.toString()
    );


    
    console.log("start("+project.name+")");


    const minutesCounter = interval(60000);
    const sub = minutesCounter.subscribe(n =>
    console.log(`It's been ${n + 1} minutes since saving!`));

    //this.task_id = '1234';//
    //this.timerService.startTimer(this.task_id, "start");

  }

  //stopTimer(task_id): void {
  stop(project): void {
    this.timerService.stop(project.name);
    console.log("stop("+project.name+")");

    this.timerService.sendMessage((this.timeMessage));
    this.messageList.push(this.timeMessage);
    this.taskTime = this.timeMessage;
    this.task_id = '1234';
    this.timerService.stopTimer(this.task_id);
    //this.timerService.stop(project.name);
    

    //get time form database.
    //this.timerService.getTime();
    //this.projectsService.getTimers();


    /*
    this.timerService.getDiff(project.name).subscribe(returnDiff => {
      if (returnDiff) console.log("timerService.getDiff(): returnDiff.docs = "+returnDiff.docs);
    })*/

    //project.totalTime = this.taskTime;

    this.timerService.updateTimer(project.name).subscribe(totalTime => {
      project.totalTime = totalTime;
      //if (totalTime) console.log("totalTime = "+totalTime);
    })

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
