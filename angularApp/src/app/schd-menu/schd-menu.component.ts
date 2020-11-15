import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CoursesService} from '../courses.service';

@Component({
  selector: 'app-schd-menu',
  templateUrl: './schd-menu.component.html',
  styleUrls: ['./schd-menu.component.css']
})

export class SchdMenuComponent implements OnInit {

  schedules: any = [];
  scheduleName: string = '';
  deleteSchd: string = '';
  viewSchd: string = '';
  modSchdName: string ='';
  courses = [];
  counter: number = 0;
 
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
  }

  add(){
    this.courses.push({subject: "", courseCode :""});
    if (this.inputValidation(this.courses[this.counter].subject) == true && this.inputValidation(this.courses[this.counter].subject)== true){
      this.courses[this.counter] // delete an array item??
    }
    console.log(this.courses);
  }

  saveSchedule(){
    let newSchd = {
      name: "",
      num : "0"
    }

    //Ask Sanah about this 
    if(this.inputValidation(this.scheduleName) == true){
      newSchd.name = this.scheduleName;
    }
  
    this.coursesService.saveSchdName(newSchd);
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

    newSchd["num"] = number.toString();
    console.log(newSchd);

    this.coursesService.saveCoursesToSchd(newSchd);
  }

  delAll(){
    this.coursesService.deleteAllSchds();
    //alert("All Schedules Deleted")
  }

  viewAll(){
    this.coursesService.viewAllSchds().subscribe(schds => {
      this.schedules = schds;});
  }

  viewSchedule(){
    if(this.inputValidation(this.viewSchd) == true){
      this.coursesService.viewSchd(this.viewSchd).subscribe(schds => {
        this.schedules = schds;
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
