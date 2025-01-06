import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgIf],

  template: `
    <div class="popup-overlay" (click)="closePopup($event)">
      <div #popupContent class="popup-content" (click)="$event.stopPropagation()">
        <img class="image" *ngIf="data.Image" [src]="base64Image" />
        <h4>[{{ data?.Title }}]</h4>
        <p>"{{ data?.Dream }}"<br />
        [{{ data?.Date }} - {{ data?.Type }}]<br /></p>
        <button (click)="onClose()">Close</button>
        <button (click)="share()">Share on IG</button>
      </div>
    </div>
  `,
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  @ViewChild('popupContent') popupContent!: ElementRef;
  @Input() data: any;
  @Input() onClose!: () => void;
  title = 'DreamShare';
  imageUrl: string | undefined; // To store the image URL
  base64Image: string | null = null;  // Store Base64 image data
  image: string | ArrayBuffer | null = null;

  constructor() {}

  closePopup(event: Event) {
    event.stopPropagation();
    this.onClose();
  }
  GetImage() {
    const payload = {
      s3_url: this.data?.Image 
    };
      
        fetch('https://7rqyealrd7.execute-api.ca-central-1.amazonaws.com/prod', {
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
            const parsedBody = data.body;
  
            if (parsedBody && parsedBody.base64_image) {
              const base64Image = parsedBody.base64_image;
              this.base64Image = `data:image/jpeg;base64,${base64Image}`; // Add the data URI scheme
              this.image = this.base64Image; // Bind it for display
            } else {
              throw new Error('Invalid response format');
            }
          })
      } 
  
  ngOnInit(){
    this.GetImage()
  }

  async share() {
    if (!this.popupContent) {
      console.error('Popup content is not available for sharing!');
      return;
    }
    const popupElement = this.popupContent.nativeElement;
    await this.captureAndShareImage(popupElement);
  }

  async captureAndShareImage(element: HTMLElement): Promise<void> {
    try {
      // Capture the element as a canvas
      const canvas = await html2canvas(element, { useCORS: true });

      // Convert the canvas to a Blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      );

      if (!blob) {
        console.error('Failed to create Blob from canvas');
        return;
      }

      // Create a File object from the Blob
      const filesArray = [
        new File([blob], `${this.title || 'shared-image'}.png`, {
          type: 'image/png',
          lastModified: new Date().getTime(),
        }),
      ];

      const shareData = {
        files: filesArray,
      };

      // Share the File using the Web Share API
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Shared successfully!');
      } else {
        console.error('Sharing not supported on this device or browser.');
      }
    } catch (error) {
      console.error('Error during capture or share:', error);
    }
  }
}
