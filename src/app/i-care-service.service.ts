import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, switchMap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiUrl: string= "https://test.lullaboo.com/fmi/data/v1/databases/iCareStaffPortalAccess";
  private subject = new Subject();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private tokenUserSubject = new BehaviorSubject<string | null>(null);
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  staffToken: string = "";

  private user = new BehaviorSubject<any>(null);
  private userToken = new BehaviorSubject<any>(null);
  private userBearer = new BehaviorSubject<any>(null);
  private campusAPI = new BehaviorSubject<any>(null);
  private userID = new BehaviorSubject<any>(null);
  private profile = new BehaviorSubject<any>(null);
  private policies = new BehaviorSubject<any>(null);
  private newHireUser = new BehaviorSubject<any>(null);
  private userEmail = new BehaviorSubject<any>(null);
  private events = new BehaviorSubject<any>(null);
  private additionalPolicies = new BehaviorSubject<any>(null);
  user$ = this.user.asObservable();
  userToken$ = this.userToken.asObservable();
  userBearer$ = this.userBearer.asObservable();
  campusAPI$ = this.campusAPI.asObservable();
  userID$ = this.userID.asObservable();
  profile$ = this.profile.asObservable();
  policies$ = this.policies.asObservable();
  newHireUser$ = this.newHireUser.asObservable();
  userEmail$ = this.userEmail.asObservable();
  events$ = this.events.asObservable();
  additionalPolicies$ = this.additionalPolicies.asObservable();

/*
Set Observable Data
*/
  setUser(data:string){
    this.user.next(data);
  }
  setUserToken(data:any){
    this.userToken.next(data);
  }
  setUserBearer(data:any){
    this.userBearer.next(data);
  }
  setCampus(data:any){
    this.campusAPI.next(data);
  }
  setUserID(data:any){
    this.userID.next(data);
  }
  setProfile(data:any){
    this.profile.next(data);
  }
  setPolicies(data:any){
    this.policies.next(data);
  }
  setAdditionalPolicies(data:any){
    this.additionalPolicies.next(data);
  }
  setNewHireUser(data:any){
    this.newHireUser.next(data);
  }
  setUserEmails(data:any){
    this.userEmail.next(data);
  }
  setEvents(data:any){
    this.events.next(data);
  }

  //Update User / Profile Information
  //TODO: Emit and Listen may not be needed remove these functions if not needed
  emit(eventName:string, payload: any){
    this.subject.next({eventName,payload});
  }

  listen(eventName: string, callback: (event:any)=> void){
    this.subject.asObservable().subscribe((nextObj:any)=>{
      if(eventName === nextObj.eventName){
        callback(nextObj.payload);
      }
    });

  }

  constructor(private http: HttpClient){}

// Function to return Readonly Access iCare API
  getStaffToken():Observable<any>{
    const encodedCreds = btoa('StaffPortalAccess:StaffPortalAccess');
    let token = '';
    const headers = new HttpHeaders({
      Authorization:`Basic ${encodedCreds}`
    },);
    headers.set('Content-Type','application/json');
    const options = { headers };
    const staffToken = this.http.post<any>(`${this.apiUrl}/sessions`,{}, options)
    return staffToken;
  }

// Function to return an object of the campusses must pass a read only access token to be used
  getCampuses(token:string):Observable<any>{
    const header = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    header.set('Content-Type','application/json');
    const options = { headers:header };
    const dataQuery = {
      query:[
        {CampusinventoryID:'*'},
      ]
    };
    const campuses = this.http.post<any>('https://test.lullaboo.com/fmi/data/v1/databases/iCareStaffPortalAccess/layouts/campusInventoryExtendedStaffPortal/_find',dataQuery,options);
    return campuses;
  }

// Function to get token for user logged in
// TODO: make bota value part of user object for when token expires to gain new token.
  login(credentials: string): Observable<any>{
    const encodedCredentials = btoa(`${credentials}`);
    const headers = new HttpHeaders({
      Authorization:`Basic ${encodedCredentials}`
    },);

    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${this.apiUrl}/sessions`,{}, options);
  }

// General Search for portal function
// Use to test API calls
  queryPortal(urlCall:string, token:string, data:any):Observable<any>{
    let bToken = token;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${bToken}`
    },);
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${urlCall}`,data, options);
  }

// Kill a token session.
// Use for logging out or when using read only functions.
  endSession(token:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/sessions/${token}`);
  }

  //Fetching calendar event data, along with the days on which the event runs and the rooms for which it applies
  calendarEventStaffPortal(token:string){
    //const startDate:Date = new Date();
    const startDate:Date = new Date('1/1/2022');
    let endDate:Date = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const header = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    header.set('Content-Type','application/json');
    const options = { headers:header };
    const dataQuery = {
      query:[
        {
        startDate:`> ${startDate.toLocaleDateString()}`,
        endDate:`< ${endDate.toLocaleDateString()}`
        }
      ]
    };
    const events = this.http.post<any>('https://test.lullaboo.com/fmi/data/v1/databases/iCareStaffPortalAccess/layouts/calendarEventStaffPortal/_find',dataQuery,options);
    return events;
  };


  // Fetching photographs associated with the monthly reports of various highlighted staff positions (e.g., district manager, supervisor, etc.)
  calendarMonthCalendarHighlightPositionContainerStaffPortal(){};

  // Fetching information about a campus
  // TODO: Ask Pravin how to use if there is no bearer token. is there a basic user for queriing this information. 
  campusStaffPortal(){};

  // Fetching a list of campuses and names
  // Fetching the API URL for a specific campus
  // TODO: Ask Pravin how to use if there is no bearer token. is there a basic user for queriing this information.
  // NOTE: should only be done on head office campus
  campusInventoryBasicStaffPortal(){};
  campusInventoryExtendedStaffPortal(){};

  staffPortalUserAccountStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let user:any = this.user$;
    let userAccount = user.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {accountName:`=${userAccount}`},
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/staffPortalUserAccountStaffPortal/_find`,dataQuery, options);
  };

  staffExtendedStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {staffID:`=${userID}`},
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/staffExtendedStaffPortal/_find`,dataQuery, options);
  }

  // Get Initial Policies signed or unsinged by current staff
  initialPolicySignatureStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {staffID:`=${userID}`},
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/initialPolicySignatureStaffPortal/_find`,dataQuery, options);
  }

  // Get annual policies that need to be signed
  policySignatureStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {staffID:`=${userID}`},
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/policySignatureStaffPortal/_find`,dataQuery, options);
  }

  /*
  Submitting information for updates / new entries
  Verifying submittals of information processed properly
  */
  dataQueueStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {staffID:`=${userID}`},
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/dataQueueStaffPortal/_find`,dataQuery, options);

  }

  /*
  Fetching basic data about a staff member in “new hire” status (i.e., before staff member has become an active employee)
  */
  newHireBasicStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {newHireID:`=${userID}`}, // TODO: Update userID for newHireID
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/newHireBasicStaffPortal/_find`,dataQuery, options);
  }

  newHireExtendedStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {email:`=${userID}`}, // TODO: Update userID for newHire Email
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/newHireExtendedStaffPortal/_find`,dataQuery, options);
  }

  newHireInitialPolicySignatureStaffPortal():Observable<any>{
    let bToken:any = this.userBearer$;
    let token = bToken.source._value;
    let campusAPI:any = this.campusAPI$;
    let api = campusAPI.source._value;
    let userAccountID:any = this.userID$;
    let userID = userAccountID.source._value;
    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    },);
    const dataQuery = {
      query:[
        {newHireID:`=${userID}`}, // TODO: Update userID for newHireID
      ]
    };
    headers.set('Content-Type','application/json');
    const options = { headers };
    return this.http.post<any>(`${api}layouts/newHireInitialPolicySignatureStaffPortal/_find`,dataQuery, options);
  }

  pendingStaffPortalUpdateStaffPortal(){}

}
