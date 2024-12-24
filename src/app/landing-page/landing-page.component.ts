import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2, NgModule} from '@angular/core';
import * as $ from 'jquery';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgForOf, NgStyle, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DraggableDirective } from 'app/draggable.directive';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupComponent } from 'app/popup/popup.component';
import { AuthService } from 'app/auth.service';
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
  randomPositions: { top: string, left: string }[] = [];
  animationStates: string[] = [];
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
    console.log(window.DreamID)
  }
  
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  windows: any[] = [];

  constructor(private auth: Auth,private authservice: AuthService ,private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router, private deviceService: DeviceDetectorService) {
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
        this.windows = data;
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