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
  counter: number = 1;

  public items:any[];
  

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
  }

  add(){
    
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

  }
}
