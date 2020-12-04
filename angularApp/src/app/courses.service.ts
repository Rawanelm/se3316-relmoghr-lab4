import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
  searchUrl = "/api/open"; //used for search fo functionality

  list: any = [];

  getSubjects(){
    this.list = this.http.get(this.searchUrl);
    return this.list;
  }

  getSearchResults(sub, code){
    if(sub != "" && code != "" ){
      return(this.http.get(this.searchUrl + `/${sub}` + `/${code}`));
    } 
  }

  viewAllSchds(){
    return this.http.get('/api/open/schedules/all');
  }

  saveCoursesToSchd(Schd){
    return this.http.post('/api/open',{Schd});
  }

  checkScheduleName(scheduleName){
    return this.http.get('/api/open/schedules/check/'+ `${scheduleName}`);
  }
  
  //this is not working
  addReview(review){
    return this.http.post('/api/secure/reviews/', {review});
  }

  viewReviews(course){
    return this.http.get('/api/open/reviews/'+ `${course}`);
  }
  
  /*
  deleteAllSchds(){
    return this.http.get('/api/open/schedules/del/all');
  }*/
}