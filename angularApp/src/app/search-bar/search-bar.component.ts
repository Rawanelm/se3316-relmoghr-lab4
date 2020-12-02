import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {

  courses :any =[];
  sub: string = '';
  code: string = '';

  constructor(private CoursesService: CoursesService) {
  }

  ngOnInit(): void {
  }

//call service function to retrieve information for all courses
 viewAll(){
    this.CoursesService.getSubjects().subscribe(courses =>{ this.courses = courses;
    });
  }

  //send parameters to service in order to retrieve courses based on user input
  search(){
    if(this.inputValidation(this.sub) == true && this.inputValidation(this.code) == true){
      this.CoursesService.getSearchResults(this.sub,this.code).subscribe(courses =>{ this.courses = courses;
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
