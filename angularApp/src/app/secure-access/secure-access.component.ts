import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import { DatePipe } from '@angular/common';
import {AngularFireAuth} from '@angular/fire/auth';
import { AppComponent } from '../app.component';
import firebase from 'firebase/app';


@Component({
  selector: 'app-secure-access',
  templateUrl: './secure-access.component.html',
  styleUrls: ['./secure-access.component.css']
})
export class SecureAccessComponent implements OnInit {

  subject: string = '';
  courseCode: string = '';
  review: string = '';
  result: any;
  date: any;

  schdDescr: string = '';

  name:string = '';
  
  schedules: any = [];
  deleteSchd: string = '';
  viewSchd: string = '';
  modSchdName: string ='';
  courses = [];
  counter: number = 0;
  savedCourses: any = [];
  objects: any = [];
  others: any = [];
  constructor(private coursesService: CoursesService,private app: AppComponent,public auth:AngularFireAuth) { }

  ngOnInit(): void {
  }

  getName(){
    this.coursesService.getName(this.app.loggedInEmail).subscribe(name =>{ this.result = name
    name = this.result.name});
  }

  //adds more input fields for the suer to add courses 
  add(){
    this.courses.push({subject: "", courseCode : ""});
    console.log(this.courses);
  }

  //ensures that schedule exists
  checkScheduleName(){
    if(this.modSchdName != ''){
    this.coursesService.checkScheduleName(this.modSchdName).subscribe(schds => {this.schedules = schds;
      
      if(this.schedules.status == 4){
        alert("Schedule name already exists")
      }
      else if(this.schedules.status == 1){
        this.saveNewCourses();        
      }
    });
  } else{alert("Schedule Name is required!");}
  }

  //saves schedule with subject and course code pairs
  saveNewCourses(){
    this.getName();
    let number = 0;
    let newSchd = {
      name: "",
      num: 0,
      description: this.schdDescr,
      user: this.app.loggedInEmail,
      visibility: "",
      dateModified: Date.now()
    }

    for(let k =0; k< this.courses.length; k++){
    if (this.inputValidation(this.courses[k].subject) == false && this.inputValidation(this.courses[k].subject)== false){
      this.courses.splice((k),1); // delete an array item if the characters are not valid
    }}

    if(this.inputValidation(this.modSchdName) == true){
      newSchd.name = this.modSchdName;
    }
    
    for(let i = 0; i< this.courses.length; i++){
      if(this.courses[i].subject != "" && this.courses[i].subject != ""){
        newSchd[("course _" + (i+1).toString())] =  this.courses[i];
        number++;
      }
    }

    newSchd["num"] = number;
    console.log(newSchd);

    this.coursesService.saveCoursesToSchd(newSchd).subscribe(list => {this.schedules = list});
    this.counter = 0;
  }

  //gets all user schedules 
  viewUser(){
    this.coursesService.viewUserSchedules(this.app.loggedInEmail).subscribe(schds => {
      this.schedules = schds});
    
    for(let i = 0; i <this.schedules.length; i++){
        for(let j = 0; j< this.schedules[i].num; j++){
          this.objects[j].push(this.schedules[j].Schd[("course_"+(j+1).toString())])
          console.log(this.objects)
          this.savedCourses[j].push(this.objects[j].subject);
          console.log(this.savedCourses);
      }
    }
  }

  //expands search results
  expand(){

  }

  //deletes a course list
  delete(name){
    this.coursesService.saveCoursesToSchd(name).subscribe(list => {this.schedules = list});
  }

  //returns search results to Summary view
  collapse(){

  }

  postReview(){
    this.getName();
    //ensures that all required fields are entered 
    if(this.subject ==''|| this.courseCode ==''||this.review ==''){
       alert("To add a review, subject, course code, and review fields must not be empty.")
    } else{
        //this.date=new Date();
        //let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
        let userReview = {
          "subject":this.subject, 
          "courseCode":this.courseCode, 
          "review" : this.review,
          "date": Date.now(),
          "visibility":"not hidden",
          "userName": name}

          this.coursesService.addReview(userReview).subscribe(status =>{ this.result = status;
            if(this.result.status == 4){
              alert("Course does not exist");
            }
            else if(this.result.status == 1){
              alert("Review Saved")     
            }
          });
    }
  }

   
  saniEmailPass(name){
    if(this.app.emailPassInputSani(name)==false){
      alert("Please input a valid email and password. Note: password special characters do not allow: '^(){}[]<>+=:;/,-");
    }
    else{
      this.updatePassword(name);
    }
  }
 
  updatePassword(pswd){
    var user = firebase.auth().currentUser;
    user.updatePassword(pswd).then(function() {
      alert("Password update")
    }).catch(function(error) {
      console.log(error);
    });
  }

  //input sanittization, ensures that input does not contain any html,css, javascript characters
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
}

