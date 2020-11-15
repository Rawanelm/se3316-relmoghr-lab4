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
  comp: string = '';

  constructor(private CoursesService: CoursesService) {
   }

  ngOnInit(): void {
  }

 viewAll(){
    this.CoursesService.getSubjects().subscribe(courses =>{ this.courses = courses;
    });
  }

  search(){
    this.CoursesService.getSearchResults(this.sub,this.code,this.comp).subscribe(courses =>{ this.courses = courses;
    });
  }
}
