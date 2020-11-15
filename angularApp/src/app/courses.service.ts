import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
  url = "/api/catalog/subject"; //used for all search functionality

  list: any = [];

  getSubjects(){
    this.list = this.http.get(this.url);
    return this.list;
  }

  getSearchResults(sub, code, comp){
    if (sub != "" && code == "" && comp == ""){
      return(this.http.get(this.url + `/${sub}`));
    } else if(sub != "" && code != "" && comp == ""){
      return(this.http.get(this.url + `/${sub}` + `/${code}`));
    } else if ((sub != "" && code != "" && comp != "")){
      return(this.http.get(this.url + `/${sub}` + `/${code}` + `/${comp}`));
    }
  }

  viewAllSchds(){
    return this.http.get('/api/catalog/schedules/all');
  }

  viewSchd(schdName){
    return this.http.get(`/api/catalog/schedules/print/${schdName}`);
  }

  saveSchdName(schdName){
    return this.http.post('/api/catalog',{schdName});
  }

  saveCoursesToSchd(Schd){
    return this.http.post('/api/catalog',{Schd});
  }

  deleteSchd(schdName){
    return this.http.get(`/api/catalog/schedules/delete/${schdName}`);
  }

  deleteAllSchds(){
    return this.http.get('/api/catalog/schedules/del/all');
  }
}