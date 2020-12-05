import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  ngOnInit(): void {
  }

  lists: any = [];
  accounts = [];
  name: string = '';
  email: string = '';
  password: string = '';
 
 
  invalid = false;
  constructor(public auth:AngularFireAuth, private  CourseService: CoursesService){
  }
 
  signUp(email:string, password:string, name: string){
    if(this.invalid == false){
    this.auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user);
      //save user info to local db
      this.saveAccountInfo();
      alert("Account successfully made");
    }).catch((error) => {
      var errorCode = error.code;
      if(errorCode == 'auth/email-already-in-use'){
        alert("Email is aleady in use by another account.")
      }
      else if(errorCode == 'auth/invalid-email'){
        alert("Please enter a valid email.")
      }
      else if(errorCode == 'auth/weak-password'){
        alert("Password is weak! Must use atleast 6 characters.")
      }
      else{
        console.log(error)
      }
    });}
  }
 
  checkContent(){
    var z = document.forms["myForm2"]["name"].value;
    var x = document.forms["myForm2"]["email"].value;
    var y = document.forms["myForm2"]["password"].value;
    if (z == "") {
      alert("Please input a name");
      this.invalid = true; 
    }
    else if (x == "") {
      alert("Please input a valid email address");
      this.invalid = true; 
    }
    else if (y == ""){
      alert("Please input a password");
      this.invalid = true; 
    }
    else{
      this.invalid = false;
    }
  }
 
  saveAccountInfo(){
    let newAccount = {
      name: "",
      email: "",
      status: "active",   
      access: "user"
    }
 
    newAccount.name = this.name;
    newAccount.email = this.email;
    console.log(newAccount);
 
    this.CourseService.saveAccount(newAccount).subscribe(list => {this.lists = list});
  }
}
