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
  GetImage(){
    const dreamValue = this.uploadForm.get('message')?.value;
    if (dreamValue){
      if (dreamValue.trim()) {
        const encodedPrompt = encodeURIComponent(dreamValue); // URL encode the prompt
        const url = `https://pollinations.ai/p/${encodedPrompt}`;
  
        // Fetch the image as a Blob
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => this.convertBlobToBase64(blob))
          .then((base64) => {
            this.base64Image = base64;  // Bind the Base64 string to display the image
          })
          .catch((error) => {
            console.error('Error fetching image:', error);
          });
      }
    }
    else{
      alert('please provide a dream first')
    }
    
  }
  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);  // Resolve with Base64 string
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);  // Convert Blob to Base64
    });
  }

  onSubmit() {
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
