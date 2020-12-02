import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Western Timetable';

  constructor(){
  }

  register(){
      
  }

  signIn(){
    
  }

  privacyPolicy(){
    var myWindow = window.open("", "MsgWindow", "width=700,height=700");
    myWindow.document.write("<p>This is the privacy policy: </p>");
  }

  acceptableUse(){
    var myWindow = window.open("", "MsgWindow", "width=700,height=700");
    myWindow.document.write("<p>This is the acceptabel use policy</p>");
  }

  takedown(){
    var myWindow = window.open("", "MsgWindow", "width=700,height=700");
    myWindow.document.write("<p>This is the DMCA Notice & Takedown Policy: </p>"); 
  }
}
