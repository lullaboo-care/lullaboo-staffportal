import { Component, OnInit } from '@angular/core';
import { Policy } from '../../shared/models/policy';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoginService } from '../i-care-service.service';
import { Router } from '@angular/router';

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
  constructor(private loginService: LoginService, private router: Router) { }
  ngOnInit() {
    this.loginService.initialPolicySignatureStaffPortal().subscribe(policies=>{
      this.policies = policies.response.data
      this.loginService.setPolicies(this.policies);
    }, error =>{
      console.error(`Problem Retriving Initial Policy Information : ${error.message}`)
    })
    this.loginService.policySignatureStaffPortal().subscribe(policies=>{
      this.addtionalPolicies = policies.response.data
      this.loginService.setAdditionalPolicies(this.addtionalPolicies);
    }, error =>{
      console.error(`Problem Retriving Addtional Policy Information : ${error.message}`)
    })
  }
}
