import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../i-care-service.service';
import { PolicyComponent } from '../policy/policy.component';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, PolicyComponent,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers:[],
})
export class ProfileComponent implements OnInit{

  profileData: any = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    work_email: 'john.doe@work.com',
    address: '55 Something Street',
    city: 'Toronto',
    number: '4165555555',
    policy: [
      { name: 'Playground Safety', signiture: true, signDate: '2018-01-01' },
      { name: 'Kitchen Safety', signiture: false, signDate: '2020-01-01' },
      { name: 'Compliance Training', signiture: true, signDate: '2018-01-01' },
      { name: 'AODA', signiture: false, signDate: '2020-01-01' },
    ]
  };

  profileLoadingData: any = {
    firstName:"Loading",
    lastName:"Loading",
    cellPhone: "Loading",
    email: "Loading",
    'jobTitle::jobTitle': "Loading",
  }

  constructor(private loginService: LoginService, private router: Router, private sanitizer: DomSanitizer) { }

  basicData:any;
  userID:string ='';
  profile:any = this.profileLoadingData;
  policies:any;
  imageUrl: SafeResourceUrl = "";

  // Convet BaseString to a usable web image.
  convertBase64ToImage(base64String: string) {
    if (base64String) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${base64String}`);
    }
    return this.imageUrl;
  }


  ngOnInit() {
    this.loginService.staffPortalUserAccountStaffPortal().subscribe(data =>{
      this.basicData = data;
      this.userID = data.response.data[0].fieldData.staffID;
      this.loginService.setUserID(this.userID);
      this.loginService.staffExtendedStaffPortal().subscribe(profile => {
        this.profile = profile.response.data[0].fieldData;
        this.convertBase64ToImage(this.profile['staffBioContainer::photoBase64']);
        this.loginService.setProfile(this.profile);
      }, error =>{
        console.error(`Problem Retriving Extended Staff Information : ${error.message}`)
      });
      this.loginService.initialPolicySignatureStaffPortal().subscribe(policies=>{
        this.policies = policies.response.data
        this.loginService.setPolicies(this.policies);
      }, error =>{
        console.error(`Problem Retriving Policy Information : ${error.message}`)
      })
    }, error =>{
      console.error(`Problem Retriving Basic Staff Information : ${error.message}`)
      this.router.navigate(['']);
    });
  }

}
