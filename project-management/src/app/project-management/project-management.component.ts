import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../_services/projects.service";
import { TimerService } from "../_services/timer.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Project } from "../_models/project.model";

import { interval } from 'rxjs';



@Component({
  selector: 'app-projects-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})

export class ProjectManagementComponent implements OnInit {
  public newProject;
  public projects;
  public editProject = new Project();
  //
  newMessage: string;
  messageList: string[] = [];
  timeMessage: string;

  constructor(
    private projectsService: ProjectsService,
    private modalService: NgbModal,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
    this.projectsService.getAll().subscribe(returnProjects => {
      this.projects = returnProjects.docs;
    })

    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    const subscription = secondsCounter.subscribe(n =>
		this.timeMessage = n.toString()
    	//console.log(`It's been ${n + 1} seconds since saving!`)
	);

    const minutesCounter = interval(60000);
    const sub = minutesCounter.subscribe(n =>
    console.log(`It's been ${n + 1} minutes since saving!`));

  }

  saveProject(): void {
    /*
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    const subscription = secondsCounter.subscribe(n =>
    console.log(`It's been ${n + 1} seconds since saving!`));

    const minutesCounter = interval(60000);
    const sub = minutesCounter.subscribe(n =>
    console.log(`It's been ${n + 1} minutes since saving!`));

    //sendMessage(): void {}
    this.timerService.sendMessage((this.timeMessage));
    //this.timerService.sendMessage((this.newMessage));
    this.newMessage = '';
    */

    this.projectsService.create(this.newProject).subscribe( saveProject => {
     
      	this.projects.push(saveProject);
  		this.messageList.push(saveProject);
    })

    //this.projectsService.create(this.newProject).subscribe( saveProject => {
    //  this.projects.push(saveProject);
    //})
  }

  startTimer(): void {

    //sendMessage(): void {}
    this.timerService.sendMessage((this.timeMessage));
    //this.timerService.sendMessage((this.newMessage));
    this.newMessage = '';
    
    //this.projectsService.create(this.timeMessage).subscribe( startTimer => {
    //  this.projects.push(this.timeMessage);
    //})
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
