import { Component} from '@angular/core';
import { CoursesService } from '../courses.service';
 
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent {
  priv: any = [];
  aups: any = [];
  dmcas: any = [];
 
  constructor(private CoursesService: CoursesService) { }
 
  privacyPolicy(){
    var policy = "security";
    this.CoursesService.readPolicies(policy).subscribe(priv => {this.priv = priv
    });
  }
 
  aup(){
    var policy = "AUP";
    this.CoursesService.readPolicies(policy).subscribe(aups => {this.aups = aups
    });
  }
 
  dmca(){
    var policy = "DMCA";
    this.CoursesService.readPolicies(policy).subscribe(dmcas => {this.dmcas = dmcas
    }); 
  }
}


