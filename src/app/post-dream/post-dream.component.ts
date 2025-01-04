import { Component, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule , Validators} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider, User, signOut} from '@angular/fire/auth';





@Component({
  selector: 'app-post-dream',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule ,
  CommonModule, 
RouterOutlet],
  templateUrl: './post-dream.component.html',
  styleUrl: './post-dream.component.css'
})
export class PostDreamComponent {
  buttonpress = false;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  image: string | ArrayBuffer | null = null;
  image1: string | ArrayBuffer | null = null;
  message: string = '';
  title: string = '';
  toDisplay = false;
  isLoggedIn: boolean = false;
  user: User | null = null;
  options = ['Day Dream', 'Nightmare', 'Healing', 'Epic', 'Lucid', 'Prophetic'];
  IsPrivate: boolean = false;
  Type: string = '';
  prompt: string = '';        // Bind to input field
  base64Image: string | null = null;  // Store Base64 image data


  constructor(private fb: FormBuilder, private http: HttpClient, private Route:Router, private auth: Auth) {
    this.uploadForm = this.fb.group({
      message: ['', [Validators.required]],
      title: ['', [Validators.required]],
      Type: [this.options[0], [Validators.required]],
      IsPrivate: ['', [Validators.required]]
    });
    this.auth.onAuthStateChanged((currentUser) => {
      this.user = currentUser;
    });
  }
  gotologin(){
    this.Route.navigate(['login']);
  }
  goback(){
    this.Route.navigate(['']);
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(this.image)
        this.image?.toString().split(",")
        this.image = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  GetImage() {
    const dreamValue = this.uploadForm.get('message')?.value.trim();
    this.buttonpress = true;
  
    if (dreamValue) {
      if (dreamValue) {
        const payload = {
          body: JSON.stringify({ message: dreamValue })
        };
  
        fetch('https://3690jjsk4e.execute-api.ca-central-1.amazonaws.com/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const parsedBody = JSON.parse(data.body);
  
            if (parsedBody && parsedBody.base64_image) {
              const base64Image = parsedBody.base64_image;
              this.base64Image = `data:image/jpeg;base64,${base64Image}`; // Add the data URI scheme
              this.image = this.base64Image; // Bind it for display
            } else {
              throw new Error('Invalid response format');
            }
          })
          .catch((error) => {
            alert('An unknown error occured :(, try again soon');
          });
      } else {
        alert('Please provide a non-empty dream');
      }
    } else {
      alert('Please provide a dream first');
    }
  }
  
  
  

  submit() {
    if (this.uploadForm.valid) {
      const body = {
        UserId: this.user?.uid,
        AuthorName: this.user?.displayName,
        message: this.message,
        title: this.title,
        image: this.image?.toString().split(",")[1],
        type: this.uploadForm.get('Type')?.value,
        isPrivate: this.uploadForm.get('IsPrivate')?.value,
      };
      console.log(body)
  
  
      this.http.post('https://y5mdajlk73.execute-api.ca-central-1.amazonaws.com/dev', { body : JSON.stringify(body)  }).subscribe(response => {
      console.log('Response from API:', response);
     this.toDisplay = !this.toDisplay; 
      });
    }
    else{
      alert("Please enter all values")
    }
    
  }
}
