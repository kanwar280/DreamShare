import { Component } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, signOut} from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NgModel } from '@angular/forms';
import { NgFor, NgForOf, NgStyle, NgIf, NgClass } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupComponent } from 'app/popup/popup.component';
import { AuthService } from 'app/auth.service';
import { UserDataService } from 'app/userdata.service';
import { Renderer2 } from '@angular/core';
import { DataServiceService } from 'app/data-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, NgStyle, NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: User | null = null;
  options = [
    { label: 'My Dreams', value: 'mydreams' },
    { label: 'Saved Dreams', value: 'saveddreams' }
  ];
  fadeState = '';
  svgFillColor: string = 'black'; 
  randomPositions: { top: string, left: string }[] = [];
  randomTransformations: { rotate: string, }[] = [];
  windows: any[] = [];
  displayedwindows: any[] = [];
  windowIndex = 5;
  totalWindowCount = 0;
  selectedOption = 'mydreams'; // Default selected option
  results: string[] = []; // Placeholder for results
  selectedwindows: any = null;
  selectedWindow: any = null;

  constructor(private auth: Auth, private Route: Router, private userdata: UserDataService,private authservice: AuthService ,private renderer: Renderer2, private dataservice:DataServiceService, private deviceService: DeviceDetectorService) {
    // Check if the user is already logged in
        this.auth.onAuthStateChanged((currentUser) => {
          this.user = currentUser;
        });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(result => {
        this.user = result.user; // Store the logged-in user
        console.log('User signed in:', result.user);
      })
      .catch(error => {
        console.error('Error during sign-in:', error);
      });
  }
  closePopup(): void {
    this.selectedWindow = null;
  }

  saveDream(window: any) {
    if (this.user == null) {
      alert("You're not signed in");
      return;
    }
  
  
    const UserID = this.user.uid;
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
  openPopup(window: any): void {
    this.selectedWindow = window;
  }
  toggleView(window: any): void {
    if (!window.hideContent) {
      // Trigger hiding animation
      window.hideContent = true;
    } else {
      // Delay showing animation slightly
      setTimeout(() => {
        window.hideContent = false;
      }, 50); // Small delay to allow animations
    }
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('User logged out successfully.');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
  goback(){
    this.Route.navigate(['']);
  }

  getCombinedStyles(window: any, position: { top: string; left: string }, transformation: { rotate: string}) {
    const backgroundStyle = window.Image
      ? {
          'background-image': `url(${window.Image})`,
          'background-size': 'cover',
          'background-position': 'center',
          'border-radius': '10px',
          'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }
      : { 
    
      };
      const transformationStyle = {
        transform: `rotate(${transformation.rotate})`
      };
    return { ...position, ...backgroundStyle, ...transformationStyle };
  }
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
          left: `${Math.random() * 70}vw`
        }));
        this.randomTransformations = this.windows.map(() =>({
          rotate: `${(Math.random() * 20.6) - 5.6}deg`
        }))
        this.displayedwindows = this.windows.slice(0, 5);
        this.totalWindowCount = this.windows.length;
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
  }
}
