import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CoursesService} from './courses.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Western Timetable';
  type = 'Not Logged In';
  loggedInEmail: string = '';
  lists: any = [];
 
  constructor(public auth:AngularFireAuth, public CoursesService: CoursesService){
  }
 
  logout():void{
      this.auth.currentUser
      .then((user) => {
        if(user){
          this.auth.signOut();
          this.loggedInEmail = "";
          this.type = 'Not Logged In';
        }
      });
  }
 
  getStatus(email: string){
    //check if the email sent is an admin
    this.CoursesService.checkAccStatus(email).subscribe(list => {this.lists = list});
 
    //if user is an admin
    if(this.lists.status == 1){
      return true;
    }
    else if(this.lists.status == 0){
      return false;
    }
  }

  inputValidation(name){
    if(name.length > 20 || name.length < 0 || name.includes('#') || name.includes('/') || name.includes(':') || name.includes('.') 
    || name.includes(',') || name.includes('?') || name.includes('<') || name.includes('>') || name.includes('%') || 
    name.includes('-') || name.includes('[') || name.includes(']') || name.includes('(') || name.includes('!') || 
    name.includes(')') || name.includes("'") || name.includes('@') || name.includes(',') || name.includes('$') || 
    name.includes('{') || name.includes('}') || name.includes('^') || name.includes('&') || name.includes('*') || 
    name.includes('=') || name.includes('+'))
    {
        alert("Please input only valid characters, up to 20 maximum! Numbers and letters only.")
        return false;
    }
    else
        return true; 
  }
  emailPassInputSani(name){
    if(name.length > 20 || name.length < 0 || name.includes('/') || name.includes(':') 
    || name.includes(',') || name.includes('<') || name.includes('>') || 
    name.includes('-') || name.includes('[') || name.includes(']') || name.includes('(') || 
    name.includes(')') || name.includes("'") || name.includes(',') || 
    name.includes('{') || name.includes('}') || name.includes('^') || name.includes('*') || 
    name.includes('=') || name.includes('+'))
    {
        return false;
    }
    else
      return true; 
    }

}
