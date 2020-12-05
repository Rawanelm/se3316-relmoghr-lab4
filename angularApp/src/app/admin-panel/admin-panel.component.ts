import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import { AppComponent } from '../app.component';
import {AngularFireAuth} from '@angular/fire/auth';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent{

  lists : any = [];

  constructor(public auth:AngularFireAuth, private app: AppComponent,private CoursesService: CoursesService) { }

  getTokenOfCurrentUser():void{
    this.auth.currentUser
    .then((user) => {
      if(user){
          alert(this.app.loggedInEmail);
      }
    });
  }
 
  saniEmailPassA(name){
    if(this.app.emailPassInputSani(name)==false){
      alert("Please input a valid email. Note: email special characters do not allow: '^(){}[]<>+=:;/,-");
    }
    else{
      this.addAdmin(name);
    }
  }
 
  addAdmin(newAdmin : string):void{
    this.auth.currentUser
    .then((user) => {
      if(user){
        //check status to see if current user is admin
        let uEmail = this.app.loggedInEmail;
        if(this.app.getStatus(uEmail) == true){
          //check if neAdmin email exists
          //if so, add admin 
          this.CoursesService.addAdmin(newAdmin).subscribe(list => {this.lists = list});
          if(this.lists.status == 0){
            alert("This account doesn't exist");
          }
          else{
            alert(newAdmin + " is now an admin!")
          }          
        }
        else{
          alert("Only admin accounts have access to this functionality!");
        }
      }
    });
  }
 
  changeActivation(email: string):void{
    this.auth.currentUser
    .then((user) => {
      if(user){
        //check status to see if current user is admin
        let uEmail = this.app.loggedInEmail;
        if(this.app.getStatus(uEmail) == true){
          //check if Admin email exists
          //if so, add admin 
          this.CoursesService.changeActivation(email).subscribe(list => {this.lists = list});
          if(this.lists.status == 0){
            alert("This account doesn't exist");
          }
          else if(this.lists.status == 1){
            alert(email + " is now an activated!")
          }
          else if(this.lists.status == 2){
            alert(email + " is now an deactivated!")
          }
        }
        else{
          alert("Only admin accounts have access to this functionality!");
        }
      }
    });
  }
 
  saniEmailPassC(name){
    if(this.app.emailPassInputSani(name)==false){
      alert("Please input a valid email. Note: email special characters do not allow: '^(){}[]<>+=:;/,-");
    }
    else{
      this.changeActivation(name);
    }
  }
 
  sanitizeContent(name){
    if(name.length < 0 || name.includes('#')
   || name.includes('<') || name.includes('>') || name.includes('%') || 
    name.includes('[') || name.includes(']')  || name.includes('$') || 
    name.includes('{') || name.includes('}') || name.includes('^') || name.includes('&') || name.includes('*') || 
    name.includes('=') || name.includes('+'))
    {
        alert("Please input only valid characters. Numbers and letters only.")
        return false;
    }
    else{
        return true; 
    }
  }
 
  updateSecurity(content: string){
    this.auth.currentUser
    .then((user) => {
      if(user){
        //check status to see if current user is admin
        let uEmail = this.app.loggedInEmail;
        if(this.app.getStatus(uEmail) == true){
          if(this.sanitizeContent(content) == true){
            this.CoursesService.updateSecPrivPolicy(content).subscribe(list => {this.lists = list});
            alert("Updated");
          }
        }else{
          alert("Only admin accounts have access to this functionality!");
        }
      }
    });
  }
 
  updateDMCA(content: string){
    this.auth.currentUser
    .then((user) => {
      if(user){
        //check status to see if current user is admin
        let uEmail = this.app.loggedInEmail;
        if(this.app.getStatus(uEmail) == true){
          if(this.sanitizeContent(content) == true){
            this.CoursesService.updateDMCA(content).subscribe(list => {this.lists = list});   
            alert("Updated");
          }
        }else{
          alert("Only admin accounts have access to this functionality!");
        }
      }
    });
  }
 
  updateAUP(content: string){
    this.auth.currentUser
    .then((user) => {
      if(user){
        //check status to see if current user is admin
        let uEmail = this.app.loggedInEmail;
        if(this.app.getStatus(uEmail) == true){
          if(this.sanitizeContent(content) == true){
            this.CoursesService.updateAUP(content).subscribe(list => {this.lists = list});    
            alert("Updated");  
          }
        }else{
        alert("Only admin accounts have access to this functionality!");
      }
    }});
  }
 
  noEmptyFields(){
    var x = document.forms["myForm"]["text"].value;
    if (x == "") {
      alert("Please type something to add to policy. ");
    }
  }
}
