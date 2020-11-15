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
  values = [];
  
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
  }

  add(){
    this.values.push({value: ""});
  }

  saveSchedule(){
    this.coursesService.saveSchdName(this.scheduleName).subscribe(schds => {
      this.schedules = schds;
    });
  }

  delSchd(){
  }

  saveNewCourses(){

  }

  delAll(){

  }

  viewAll(){

  }

  viewSchedule(){
    this.coursesService.viewSchd(this.viewSchd).subscribe(schds => {
      this.schedules = schds;
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
