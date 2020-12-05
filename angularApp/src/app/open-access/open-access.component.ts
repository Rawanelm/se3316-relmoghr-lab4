import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';

@Component({
  selector: 'app-open-access',
  templateUrl: './open-access.component.html',
  styleUrls: ['./open-access.component.css']
})
export class OpenAccessComponent implements OnInit {

  courses : any = [];
  publicSchd : any = [];
  detailedSchd: any =[];

  constructor(private CoursesService: CoursesService) {
  }

  ngOnInit(): void {
    
  }

  pubSchd(){
    this.CoursesService.viewAllSchds().subscribe(schds =>{ this.publicSchd = schds;
      console.log(this.publicSchd);
    });
  }

  expand(schedule){
    //add all the courses in the schedule to the array
    this.detailedSchd = this.publicSchd;
  }

  collapse(){
    this.courses = "";
    this.detailedSchd = "";
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
