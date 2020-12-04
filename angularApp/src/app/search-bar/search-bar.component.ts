import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {

  courses :any =[];
  reviews:any = [];
  detailedCourse: any = [];
  sub: string = '';
  code: string = '';
  keyword: string = '';

  constructor(private CoursesService: CoursesService) {
  }

  ngOnInit(): void {
  }

  expand(course){
    //
    this.CoursesService.viewReviews(course.subject,course.class).subscribe(schds =>{ this.reviews = schds;
      console.log(this.reviews);
    });

    this.detailedCourse = this.courses;
  }

  keywordSearch(){
    this.courses = [];
    this.reviews =[];
    this.detailedCourse = [];
    //removes white space
    this.keyword.replace(/\s+/g, '');
      if(this.keyword.length < 4){
        alert("please enter at least 4 characters for keyword search");
      } else{
        this.CoursesService.searchByKeyword(this.keyword).subscribe(courses =>{ this.courses = courses;});
      }
  }

  //send parameters to service in order to retrieve courses based on user input
  search(){
    //clears previous search results
    this.courses = [];
    this.reviews =[];
    this.detailedCourse = [];

    if(this.sub!=""||this.code !=""){
      if(this.inputValidation(this.sub) == true && this.inputValidation(this.code) == true){
        this.CoursesService.getSearchResults(this.sub,this.code).subscribe(courses =>{ this.courses = courses;
        });
      }
      //sends alert if the user did nt enter the required info
    }else {alert("subject and course codes are required fields!")}
    console.log(this.courses);
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
