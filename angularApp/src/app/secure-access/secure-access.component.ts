import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-secure-access',
  templateUrl: './secure-access.component.html',
  styleUrls: ['./secure-access.component.css']
})
export class SecureAccessComponent implements OnInit {

  subject: string = '';
  courseCode: string = '';
  review: string = '';
  result: any;
  date: any;

  constructor(private CoursesService: CoursesService) { }

  ngOnInit(): void {
  }

  //Tested: there is no call to the backend
  postReview(){
    if(this.subject ==''|| this.courseCode ==''||this.review ==''){
       alert("To add a review, subject, course code, and review fields must nor be empty.")
    } else{
        //this.date=new Date();
        //let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
        let userReview = {
          "subject":this.subject, 
          "courseCode":this.courseCode, 
          "review" : this.review,
          "date":"",
          "visibility":"not hidden",
          "userName": ""}

          this.CoursesService.addReview(userReview).subscribe(status =>{ this.result = status;
            if(this.result.status == 4){
              alert("Course does not exist");
            }
            else if(this.result.status == 1){
              alert("Review Saved ")        
            }
          });
    }
  }
}
