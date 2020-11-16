import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CoursesService} from '../courses.service';
import * as angular from "angular";

@Component({
  selector: 'app-schd-menu',
  templateUrl: './schd-menu.component.html',
  styleUrls: ['./schd-menu.component.css']
})

export class SchdMenuComponent implements OnInit {

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

   if (this.inputValidation(this.courses[this.counter].subject) == false && this.inputValidation(this.courses[this.counter].subject)== false){
      this.courses.splice((this.counter),1); // delete an array item if the characters are not valid
    }
  }

  //sends schedule name to be deleted to service 
  delSchd(){
    if(this.inputValidation(this.deleteSchd) == true){
      this.coursesService.deleteSchd(this.deleteSchd);
    }
  }

  //saves schedule with subject and course code pairs
  saveNewCourses(){
    let number = 0;
    let newSchd = {
      name: "",
      num: 0
    }

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

  delAll(){
    this.coursesService.deleteAllSchds().subscribe(list => {this.schedules = list});
    alert("All Schedules Deleted");
  }

  viewAll(){
    this.coursesService.viewAllSchds().subscribe(schds => {
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
