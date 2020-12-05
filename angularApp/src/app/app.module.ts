import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SecureAccessComponent } from './secure-access/secure-access.component';
import { OpenAccessComponent } from './open-access/open-access.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const Routes =[
  {path: 'adminComponent', component: AdminPanelComponent },

  { path: '',   redirectTo: '/homePage', pathMatch: 'full' },

  {path: 'secureAccess', component: SecureAccessComponent},

  {path: 'openAccess', component: OpenAccessComponent},
  
  {path: 'homePage', component: HomePageComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    AdminPanelComponent,
    SecureAccessComponent,
    OpenAccessComponent,
    HomePageComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(Routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
