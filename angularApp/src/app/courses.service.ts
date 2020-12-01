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

  // we only the second one since requirements have chnaged slightly 
  getSearchResults(sub, code, comp){
    if (sub != "" && code == "" && comp == ""){
      return(this.http.get(this.searchUrl + `/${sub}`));
    } else if(sub != "" && code != "" && comp == ""){
      return(this.http.get(this.searchUrl + `/${sub}` + `/${code}`));
    } else if ((sub != "" && code != "" && comp != "")){
      return(this.http.get(this.searchUrl + `/${sub}` + `/${code}` + `/${comp}`));
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
  
  /*
  deleteAllSchds(){
    return this.http.get('/api/open/schedules/del/all');
  }*/
}