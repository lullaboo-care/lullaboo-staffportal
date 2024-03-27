import { Component, OnInit } from '@angular/core';
import { Policy } from '../../shared/models/policy';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoginService } from '../i-care-service.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatCardModule, MatExpansionModule],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements OnInit{
  policies:any;
  addtionalPolicies:any;

  // Count Policies 
  policyCount:number = 0;
  completedPolicies:number = 0;
  // Count Addtional Policies
  addtionalPoliciesCount:number = 0;
  completedAddtionalPolicies:number = 0;

  constructor(private loginService: LoginService, private router: Router, private sanitizer: DomSanitizer ) { }

  completedPoliciesNumber(){
    for(let policy of this.policies){
      if(policy.fieldData.signatureDate){
        this.completedPolicies++;
      }
    }
  }
  completedAddtionalPoliciesNumber(){
    for(let policy of this.addtionalPolicies){
      if(policy.fieldData.signatureDate){
        this.completedAddtionalPolicies++;
      }
    }
  }

  convertPolicyBase64ToImage(base64String: string) {
    let signiture: SafeResourceUrl = "";
    if (base64String) {
      signiture = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${base64String}`);
    }
    return signiture;
  }

  getStatusClass(signed:any) {
    if(signed){
      return 'completed';
    }
    return 'incomplete';
  }

  ngOnInit() {
    this.loginService.initialPolicySignatureStaffPortal().subscribe(policies=>{
      this.policies = policies.response.data;
      this.policyCount = this.policies.length;
      this.completedPoliciesNumber();
      this.loginService.setPolicies(this.policies);
    }, error =>{
      console.error(`Problem Retriving Initial Policy Information : ${error.message}`)
    })
    this.loginService.policySignatureStaffPortal().subscribe(policies=>{
      this.addtionalPolicies = policies.response.data
      this.addtionalPoliciesCount = this.addtionalPolicies.length;
      this.completedAddtionalPoliciesNumber();
      this.loginService.setAdditionalPolicies(this.addtionalPolicies);
    }, error =>{
      console.error(`Problem Retriving Addtional Policy Information : ${error.message}`)
    })
  }
}
