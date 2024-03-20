import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LoginService } from '../i-care-service.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  campuses :any =[];
  selectedCampus = '';
  selectedAPIURL:any;
  campusURL = '';

  campusFormGroup = this._formBuilder.group({
    campusCtrl: ['', Validators.required],
  });
  emailFormGroup = this._formBuilder.group({
    emailCtrl: ['', Validators.required],
    emailConfirmCtrl: ['', Validators.required],
  });
  confirmationFormGroup = this._formBuilder.group({
    confirmationCtrl: ['', Validators.required],
  });
  credsFormGroup = this._formBuilder.group({
    userNameCtrl: ['', Validators.required],
    userNameConfirmCtrl: ['', Validators.required],
    passwordCtrl: ['', Validators.required],
    passwordConfirmCtrl: ['', Validators.required],
  });


  isLinear = false;

  constructor(private loginService:LoginService,private _formBuilder: FormBuilder) {}

  ngOnInit(){

    let tokenz = ''
    this.loginService.getStaffToken().subscribe(data=>{
      tokenz = data.response.token;
      this.loginService.getCampuses(tokenz).subscribe(data=>{
        this.campuses = data.response.data;
        this.selectedAPIURL = data.response.data;
        this.loginService.endSession(tokenz);
      }, error =>{
        console.error(`Problem Retriving Campus List: ${error.message}`)
      });
    }, error =>{
      console.error(`Problem Retriving Staff Token: ${error.message}`)
    });
  }

  onSelectionChange(event:any){
    this.selectedCampus = event.value;
    this.selectedAPIURL = this.campuses.filter(
      (campus:any) => campus.fieldData.campusID === this.selectedCampus
    );
    this.campusURL = this.selectedAPIURL[0].fieldData.staffPortalAPIURL
    this.loginService.setCampus(this.campusURL);
  }

  validateEmails(){};
  getConfirmationCode(){};
  createAccount(){};
}
