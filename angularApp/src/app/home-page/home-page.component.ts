import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent {

  lists: any =[];
  
  constructor(public auth:AngularFireAuth, private router: Router, private CoursesService: CoursesService,
     private app: AppComponent){
  }
 
  loginWithGoogle(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.app.type = "USER";
  }
 
  login(email:string, password:string){    
    this.auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      if(this.verifyStatus(email) == true){
        //update header
        if(this.app.getStatus(email) == true){
          this.app.type = "ADMIN"
        }
        else if(this.app.getStatus(email) == false){
          this.app.type = "USER"
        }
        console.log(user);
        this.app.loggedInEmail = email;
      }
      else{
        alert("Account is deactivated. Please email administrator at rawan@gmail.com to resolve.")
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      if(errorCode == 'auth/wrong-password'){
        alert("Incorrect password!")
      }
      if(errorCode == 'auth/user-not-found'){
        alert("An account with this email doesn't exist!")
      }
      else{
        console.log(error)
      }
    });
  }
 
  verifyStatus(email){
    this.CoursesService.checkActivation(email).subscribe(list => {this.lists = list});
    if(this.lists.status == 1){
      return true;
    }
    else{
      return false;
    }  
  }
 
  loadSignUp($myParam: string = ''){
    const navigationDetails: string[] = ['/signup'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }
  
  saniEmailPass(name){
    if(this.app.emailPassInputSani(name)==false){
      alert("Please input a valid email and password. Note: password special characters do not allow: '^(){}[]<>+=:;/,-");
    }
  }
 
  checkContent(){
    var x = document.forms["myForm"]["email"].value;
    var y = document.forms["myForm"]["password"].value;
    if (x == "") {
      alert("Please input a valid email address");
    }
    else if (y == ""){
      alert("Please input a password");
    }
  }
}