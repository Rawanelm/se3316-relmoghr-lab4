import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';

@Component({
  selector: 'app-open-access',
  templateUrl: './open-access.component.html',
  styleUrls: ['./open-access.component.css']
})
export class OpenAccessComponent implements OnInit {

  publicSchd : any = [];

  constructor(private CoursesService: CoursesService) {
  }

  ngOnInit(): void {
    this.CoursesService.viewAllSchds().subscribe(schds =>{ this.publicSchd = schds;
      console.log(this.publicSchd);
    });
  }

  pubSchd(){
  
  }
}
