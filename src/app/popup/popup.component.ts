import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import { NgStyle } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgIf, NgStyle],

  template: `
    <div class="popup-overlay" (click)="closePopup($event)">
      <div #popupContent class="popup-content" [ngStyle]="{ 'background-color': backgroundColor }" (click)="$event.stopPropagation()">
        <img class="image" *ngIf="data.Image" [src]="base64Image" />
        <h4 [ngStyle]="{ 'color': Color }">[{{ data?.Title }}]</h4>
        <p [ngStyle]="{ 'color': Color }">"{{ data?.Dream }}"<br />
        [{{ data?.Date }} - {{ data?.Type }}]<br /></p>
        <div class="button-container">
          <button *ngIf="!isSharing" (click)="onClose()"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15px" height="15px" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" [attr.fill]="svgFillColor"></path> </g></svg></button>
          <button *ngIf="!isSharing" (click)="share()"><svg width="15px" height="15px"  viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>instagram [#167]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-340.000000, -7439.000000)" [attr.fill]="svgFillColor"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273 M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748 M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956 M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792 M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792" id="instagram-[#167]"> </path> </g> </g> </g> </g></svg></button>
          <button *ngIf="!isSharing" (click)="invert()"><svg [attr.fill]="svgFillColor" width="15px" height="15px"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" d="M4,14 C4,11.0544813 6.66666667,7.05448133 12,2 C17.3333333,7.05448133 20,11.0544813 20,14 C20,18.3349143 16.5521622,21.8645429 12.2491793,21.9961932 L12,22 C7.581722,22 4,18.418278 4,14 Z M12,4.793 L11.7832437,5.01193635 C7.89798368,8.95774552 6,12.0287291 6,14 C6,17.3137085 8.6862915,20 12,20 L12,4.793 Z"></path> </g></svg></button>
        </div>
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
  isSharing = false;
  svgFillColor = 'black';
backgroundColor = 'white';
Color = 'Black';
  constructor() {}
  invert(){
    if(this.backgroundColor == 'white'){
      this.backgroundColor = 'black';
      this.Color = 'White'
      this.svgFillColor = 'white'

    }
    else{
      this.backgroundColor = 'white';
      this.Color = 'Black'
      this.svgFillColor = 'black'

    }
    console.log("invert")
  }
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
    this.isSharing = true;
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
    this.isSharing = false;

  }
}
