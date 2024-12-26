import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2, NgModule} from '@angular/core';
import * as $ from 'jquery';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgForOf, NgStyle, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DraggableDirective } from 'app/draggable.directive';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupComponent } from 'app/popup/popup.component';
import { AuthService } from 'app/auth.service';
import { UserDataService } from 'app/userdata.service';
import { Auth, signInWithPopup, GoogleAuthProvider, User, signOut} from '@angular/fire/auth';




@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgStyle, DraggableDirective, NgIf, PopupComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  
})

//implements Afterviewinit in export class,(check typo) if using canvases.
export class LandingPageComponent{
  user: User | null = null;
  blobImageAsset!: Blob;
  title = 'DreamShare';
  items: any[] = [];
  svgFillColor: string = 'black'; 
  randomPositions: { top: string, left: string }[] = [];
  selectedWindow: any = null;
  openPopup(window: any): void {
    this.selectedWindow = window;
  }

  closePopup(): void {
    this.selectedWindow = null;
  }

  gotopost(){
    this.Route.navigate(['postdreams']);
  }
  gotologin(){
    this.Route.navigate(['login']);
  }
  removeArticle(window: any) {
    this.windows = this.windows.filter(w => w !== window);
  }
  saveDream(window:any){
    if(this.user == null){
      alert("you're not signed in");
    }
    const UserID = window.UserID;
    const DreamID = window.DreamID;
    this.userdata.saveDream(UserID, DreamID).subscribe({
      next: (response) => {
        console.log('Dream saved successfully:', response);
        window.svgFillColor = 'red';
      },
      error: (error) => {
        console.error('Error saving dream:', error);
        alert('Failed to save the dream.');
      },
    });
    console.log(window.DreamID)
  }
  likeDream(){
    if(this.user ==null){
      alert("you're not signed in yet"); 
    }
    
  }
  
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  windows: any[] = [];

  constructor(private userdata: UserDataService,private auth: Auth,private authservice: AuthService ,private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router, private deviceService: DeviceDetectorService) {
    this.auth.onAuthStateChanged((currentUser) => {
      this.user = currentUser;
    });
  }
  
    
  
  ngOnInit():void {
    console.log(this.authservice.isLoggedIn());
    setTimeout(()=>console.log(this.authservice.isLoggedIn()) , 1000 )
    console.log(this.deviceService.isMobile());
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.windows = data.map((window: any) => ({
          ...window,
          svgFillColor: 'black', // Default color
        }));
        this.randomPositions = this.windows.map(() => ({
          top: `${Math.floor(Math.random() * 70)}vh`,
          left: `${Math.floor(Math.random() * 70)}vw`
        }));
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
  }
}