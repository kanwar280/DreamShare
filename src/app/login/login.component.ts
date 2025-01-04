import { Component } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, signOut} from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NgFor, NgForOf, NgStyle, NgIf, NgClass } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, NgStyle, NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: User | null = null;

  constructor(private auth: Auth, private Route: Router) {
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

  fetchmydreams() {

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
}
