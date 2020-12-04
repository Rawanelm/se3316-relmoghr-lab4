import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
//import { DatePipe } from '@angular/common';

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

  schedules: any = [];
  deleteSchd: string = '';
  viewSchd: string = '';
  modSchdName: string ='';
  courses = [];
  counter: number = 0;
  savedCourses: any = [];
  objects: any = [];
  others: any = [];
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
  }

  add(){
    this.courses.push({subject: "", courseCode : ""});
    console.log(this.courses);
  }

  checkScheduleName(){
    this.coursesService.checkScheduleName(this.modSchdName).subscribe(schds => {this.schedules = schds;
      
      if(this.schedules.status == 4){
        alert("Schedule name already exists")
      }
      else if(this.schedules.status == 1){
        this.saveNewCourses();        
      }
    });
  }

  //saves schedule with subject and course code pairs
  saveNewCourses(){
    let number = 0;
    let newSchd = {
      name: "",
      num: 0
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

  /*delAll(){
    this.coursesService.deleteAllSchds().subscribe(list => {this.schedules = list});
    alert("All Schedules Deleted");
  }*/

  //gets all user schedules 
  viewAll(){
    this.coursesService.viewUserSchedules().subscribe(schds => {
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

  //Tested: there is no call to the backend
  postReview(){
    if(this.subject ==''|| this.courseCode ==''||this.review ==''){
       alert("To add a review, subject, course code, and review fields must nor be empty.")
    } else{
        //this.date=new Date();
        //let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
        let userReview = {
          "subject":this.subject, 
          "courseCode":this.courseCode, 
          "review" : this.review,
          "date":"",
          "visibility":"not hidden",
          "userName": ""}

          this.coursesService.addReview(userReview).subscribe(status =>{ this.result = status;
            if(this.result.status == 4){
              alert("Course does not exist");
            }
            else if(this.result.status == 1){
              alert("Review Saved ")        
            }
          });
    }
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

