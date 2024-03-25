import { Component, OnInit } from '@angular/core';
import { Policy } from '../../shared/models/policy';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { LoginService } from '../i-care-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements OnInit{
  policies:any;
  constructor(private loginService: LoginService, private router: Router) { }
  ngOnInit() {
    this.loginService.initialPolicySignatureStaffPortal().subscribe(policies=>{
      this.policies = policies.response.data
      this.loginService.setPolicies(this.policies);
    }, error =>{
      console.error(`Problem Retriving Policy Information : ${error.message}`)
    })
  }
}
