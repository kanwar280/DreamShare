import { Component, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';



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
  toDisplay = false;



  constructor(private fb: FormBuilder, private http: HttpClient, private Route:Router) {
    this.uploadForm = this.fb.group({
      message: ['']
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

  onSubmit() {
    const body = {
      message: this.message,
      image: this.image?.toString().split(",")[1]
    };
    console.log(body)


    this.http.post('https://y5mdajlk73.execute-api.ca-central-1.amazonaws.com/dev', { body : JSON.stringify(body)  }).subscribe(response => {
      console.log('Response from API:', response);
      this.toDisplay = !this.toDisplay; 
    });
  }
}
