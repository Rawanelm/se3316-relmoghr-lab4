import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }
  searchUrl = "/api/open"; //used for search functionality

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

  getName(email){
    return this.http.get('/api/secure/name'+ `/${email}`);
  }

  //gets the public schedules
  viewAllSchds(){
    return this.http.get('/api/open/all');
  }

  //gets the schedules for a specific user
  viewUserSchedules(){
    return this.http.get('/api/secure/schd/Hadi');
  }

  //saves a schedule to the database
  saveCoursesToSchd(Schd){
    return this.http.post('/api/secure/schedule',{Schd});
  }

  checkScheduleName(scheduleName){
    return this.http.get('/api/secure/schedules/check/'+ `${scheduleName}`);
  }
  
  //adds a review to database
  addReview(review){
    console.log(review);
    return this.http.post('/api/secure/review', {review});
  }

  viewReviews(subject,courseCode){
    return this.http.get('/api/open/reviews/find/'+ `${subject}/` + `${courseCode}`);
  }
  
  deleteSchd(schdName){
    return this.http.get('/api/secure/schedules/delete/'+ `${schdName}`);
  }

  checkAccStatus(email){
    return this.http.get('/api/admin/status'+ `/${email}`);
  }
 
  addAdmin(email){
    return this.http.post('/api/admin/new', {email});
  }
 
  changeActivation(email){
    return this.http.post('/api/admin/activation', {email});
  }
 
  checkActivation(email){
    return this.http.get('/api/admin/activation'+ `/${email}`);
  }

  updateSecPrivPolicy(security){
    return this.http.post('/api/admin/security', {security});
  }
 
  updateDMCA(DMCA){
    return this.http.post('/api/admin/DMCA', {DMCA});
  }
 
  updateAUP(AUP){
    return this.http.post('/api/admin/AUP', {AUP});
  }
 
  readPolicies(policy){
    return this.http.get('/api/admin/update'+ `/${policy}`);
  }

    //save account info to db
    saveAccount(account){
      return this.http.post('/api/admin/accounts', {account});
    }
  
}