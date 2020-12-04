import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
  searchUrl = "/api/open"; //used for search fo functionality

  list: any = [];

  //sends requested course and returns information about it
  getSearchResults(sub, code){
    if(sub != "" && code != "" ){
      return(this.http.get(this.searchUrl + `/${sub}` + `/${code}`));
    } 
  }

  //send keywords to API and returns its matches
  searchByKeyword(keyword){
    return(this.http.get('/api/open/search/' + `/${keyword}`));
  }

  //gets the public schedules
  viewAllSchds(){
    return this.http.get('/api/open/schedules/all');
  }

  //gets the schedules for a specific user
  viewUserSchedules(){
    return this.http.get('/api/secure/schd/RAWAN');
  }

  //saves a schedule to the database
  saveCoursesToSchd(Schd){
    return this.http.post('/api/secure/schedules/',{Schd});
  }

  checkScheduleName(scheduleName){
    return this.http.get('/api/open/schedules/check/'+ `${scheduleName}`);
  }
  
  //adds a review to database
  addReview(review){
    console.log(review);
    return this.http.post('/api/secure/reviews/', {review});
  }

  viewReviews(subject,courseCode){
    return this.http.get('/api/open/reviews/find/'+ `${subject}/` + `${courseCode}`);
  }
  
  deleteSchd(schdName){

  }
  /*
  deleteAllSchds(){
    return this.http.get('/api/open/schedules/del/all');
  }*/
}