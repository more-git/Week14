import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private socket: Socket, private httpClient: HttpClient) { }

  sendMessage(message: string): void {
    this.socket.emit('user message', message);
    // this.httpClient.post<any>(`localhost:8000/name`, {name: newName}).pipe(map(newName => new Project(newName.name)));
  }

  getMessages(): any {
    return this.socket.fromEvent('user message');
  }


  startTimer(task_id: string, start: string):void {
    this.socket.emit('timer', start, task_id);
  }

  stopTimer(task_id: string):void {
    this.socket.emit('timer');
  }

  getTimers(): any {
    //return this.socket.fromEvent('user message');
  }
 
}
