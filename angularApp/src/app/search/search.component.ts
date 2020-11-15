import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import{AppComponent}from'../app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [CoursesService]
})
export class SearchComponent implements OnInit {

  courses: any = [];
  param:any;
  subject: string ='';
  code: string ='';
  comp: string ='';

  constructor(private coursesService: CoursesService, private appComp: AppComponent) { }

  ngOnInit(): void {
   // this.param = this.appComp.param;
    this.subject= this.param.sub;
    this.code= this.param.code;
    this.comp= this.param.comp;
    

   this.coursesService.getSearchResults(this.subject, this.code, this.comp).subscribe(courses => {
      this.courses = courses;
    })
  }

}
