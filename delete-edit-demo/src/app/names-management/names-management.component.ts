import { Component, OnInit } from '@angular/core';
import {NamesService} from "../_services/names.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import {Person} from "../_models/person.model";
//import { timer } from 'rxjs';



@Component({
  selector: 'app-names-management',
  templateUrl: './names-management.component.html',
  styleUrls: ['./names-management.component.css']
})

export class NamesManagementComponent implements OnInit {
  public newName;
  public names;
  public editName = new Person();

  constructor(
    private namesService: NamesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.namesService.getAll().subscribe(returnNames => {
      this.names = returnNames.docs;
    })
  }

  saveName(): void {
    this.namesService.create(this.newName).subscribe( saveName => {
      //console.log(saveName.sayHi());
      this.names.push(saveName);
    })
  }

  deleteName(nameToDelete): void {
    this.namesService.destroy(nameToDelete).subscribe(success => {
      this.names = this.namesService.removeName(this.names, nameToDelete);
    }, error => {
      console.log(error);
    })
  }

  newEditName(content, person): void {
    this.editName = person;
	//const source = timer(1000, 2000);
	//output: 0,1,2,3,4,5......
	//const subscribe = source.subscribe(val => console.log(val));
    this.modalService.open(content).result.then((result) => {
      // this.editName -> result
      console.log("this.editName: "+this.editName);
      this.saveEditedName(this.editName);
    }, (reason) => {})
  }

  saveEditedName(nameToEdit): void {

    //console.log("saveEditedName: "+JSON.stringify(nameToEdit));

	//let observable = Rx.Observable.interval(1000);
	//observable.subscribe(x => console.log(x));	

    this.namesService.updateName(nameToEdit).subscribe(success => {
      console.log("saveEditedName: "+JSON.stringify(nameToEdit));
      this.names = this.namesService.editName(this.names, nameToEdit);
    }, error => {
      console.log(error);
    })

  }
}
