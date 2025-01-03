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
import { response } from 'express';




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
  saveDream(window: any) {
    if (this.user == null) {
      alert("You're not signed in");
      return;
    }
  
    const UserID = window.UserID;
    const DreamID = window.DreamID;
  
    this.userdata.saveDream(UserID, DreamID).subscribe({
      next: (response: any) => {
        try {
          const parsedResponse = typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;
  
          console.log('Parsed response:', parsedResponse);
  
          if (parsedResponse?.message === "Dream removed successfully") {
            console.log('Dream removed:', parsedResponse.updatedDreams);
            // Check if DreamID is in the updatedDreams array
            if (!parsedResponse.updatedDreams?.includes(DreamID)) {
              console.log(`Changing svgFillColor to black for DreamID: ${DreamID}`);
              window.svgFillColor = 'black'; // Change color to black
            }
          } else {
            console.log('Dream saved successfully:', parsedResponse);
            window.svgFillColor = 'red'; // Change color to red
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          alert('Unexpected response from the server.');
        }
      },
      error: (error) => {
        console.error('Error saving dream:', error);
        alert('Failed to save the dream.');
      },
    });
  
    console.log('DreamID:', DreamID);
  }
  
  
  likeDream(){
    if(this.user ==null){
      alert("you're not signed in yet"); 
    }
    
  }

  //WORKIONGONTHISFUNCTION()
  getSavedDreams(): void {
    console.log('Current User:', this.user); 
    if (this.user) {
      fetch('https://dkfly3c13c.execute-api.ca-central-1.amazonaws.com/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: this.user?.uid }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Http error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('dreams', data.body)
          const savedDreamIds = data.body; // Assuming this is an array of IDs
          console.log('Saved Dream IDs:', savedDreamIds);
  
          // Update the svgFillColor for matching windows
          this.windows.forEach((window) => {
            if (savedDreamIds.includes(window.DreamID)) {
              window.svgFillColor = 'red'; // Mark as saved
            }
          });
        })
        .catch((error) => {
          console.error('Error fetching saved dreams:', error);
        });
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
    setTimeout(() => console.log(this.authservice.isLoggedIn()), 1000);
    setTimeout(() => {
      console.log('Calling getSavedDreams after delay');
      this.getSavedDreams();
    }, 2000); 

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