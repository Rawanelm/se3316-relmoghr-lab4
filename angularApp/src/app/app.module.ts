import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Router, RouterModule} from '@angular/router'
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SchdMenuComponent } from './schd-menu/schd-menu.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SecureAccessComponent } from './secure-access/secure-access.component';

const Routes =[
  {
    path: 'api/catalog', component: AppComponent
  },
]
@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    SchdMenuComponent,
    AdminPanelComponent,
    SecureAccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(Routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
