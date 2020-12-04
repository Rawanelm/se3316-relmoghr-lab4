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
  keyword: string = '';

  constructor(private CoursesService: CoursesService) {
  }

  ngOnInit(): void {
  }

  expand(){
    //some function to add more details
  }

  keywordSearch(){
      if(this.keyword.length < 4){
        alert("please enter at least 4 characters for keyword search");
      }
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
