import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { LoginService } from '../i-care-service.service';

//Nice to Have Feature
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatCardModule,MatIconModule,MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[]
})

export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  url: string = "https://test.lullaboo.com/fmi/data/v1/databases/iCareStaffPortalAccess/session";
  postBody: string = "";

  token: string = '';
  error: string = '';
  testJSON: string = '';
  sessiionEnded: string = '';
  campuses :any =[];
  events :any =[];
  selectedCampus = '';
  selectedAPIURL:any;
  campusURL = '';
  showPassword: boolean = false;
  hide = true;

  constructor(private loginService: LoginService, private router :Router, private snackBar: MatSnackBar) { 
  }

  ngOnInit(){

    // Set Campus List on load
    let tokenz = ''
    this.loginService.getStaffToken().subscribe(data=>{
      tokenz = data.response.token;
      this.loginService.getCampuses(tokenz).subscribe(
        data=>{
        this.campuses = data.response.data;
        this.selectedAPIURL = data.response.data;
      }, error =>{
        console.error(`Problem Retriving Campus List: ${error.message}`)
      }
      );
      // Load Upcomming Events
      this.loginService.calendarEventStaffPortal(tokenz).subscribe(
        data=>{
          this.events = data.response.data;
          this.loginService.setEvents(this.events);
        }, error => {
          console.error(`Problem Retreving Latest Events: ${error.message}`)
        }
      );
      // Close the Session
      this.loginService.endSession(tokenz);
    }, error =>{
      console.error(`Problem Retriving Staff Token: ${error.message}`)
    });
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  onSelectionChange(event:any){
    this.selectedCampus = event.value;
    this.selectedAPIURL = this.campuses.filter(
      (campus:any) => campus.fieldData.campusID === this.selectedCampus
    );
    this.campusURL = this.selectedAPIURL[0].fieldData.staffPortalAPIURL
    this.loginService.setCampus(this.campusURL);
  }

  // Function to get Bearer Token value
  submitLogin(){
    //TODO: Create Session Cookie too keep user logged into app not just iCare 
    let credentials = `${this.username}:${this.password}`;

    this.loginService.login(credentials).subscribe(response => {
      this.token = response.response.token;
      this.loginService.setUser(this.username);
      this.loginService.setUserBearer(this.token);
      this.router.navigate(['/profile']);
    }, error => {
      console.error('Problem with login: '+ error);
      this.error = error;
    });
  }

  // Function to test queries
  getJSON(){
    let queryTest = ``;
    const host = 'test';
    const layout = 'staffPortalUserAccountStaffPortal';
    const data = {
      query:[
        {accountName:'==staffPortalTestUser'},
      ]
    } ;
    let urlCall = `https://${host}.lullaboo.com/fmi/data/v1/databases/iCareStaffPortalAccess/layouts/${layout}/_find`;
    this.loginService.queryPortal(urlCall,this.token,data).subscribe(response => {
      this.testJSON = response;
    }, error => {
      this.error = error;
    });
    this.loginService.endSession(this.token).subscribe(response => {
      this.sessiionEnded = response;
    }, error => {
      this.error = error;
    })
  }

}
