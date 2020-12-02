export class Task {
  name: string;
  task_id: string;

  // totalTime


  constructor(name: string = '', task_id:string = '') {
    this.name = name;
    this.task_id = task_id;
  }
}
