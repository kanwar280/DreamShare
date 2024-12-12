import { Component, Input , ViewChild, ElementRef} from '@angular/core';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-popup',
  standalone: true,
  template: `
    <div class="popup-overlay" (click)="closePopup($event)">
      <div #popupContent class="popup-content" (click)="$event.stopPropagation()">
        <h3>{{ data?.Title }}</h3>
        <p>{{ data?.Dream }}<br>
        ({{ data?.Date }})<br>
        ({{ data?.Type }})<br>
        <button (click)="onClose()">Close</button>
        <button (click)="share()">Share</button>
      </div>
    </div>
  `,
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @ViewChild('popupContent') popupContent!: ElementRef;
  @Input() data: any;
  @Input() onClose!: () => void;
  title = 'DreamShare';

  closePopup(event: Event) {
    event.stopPropagation();
    this.onClose();
  }
  async share(){
    if (!this.popupContent) {
      console.error('Popup content is not available for sharing!');
      return;
    } 
    const popupElement = this.popupContent.nativeElement;
    await this.captureAndShareImage(popupElement);
    /*
    html2canvas(popupElement,{
      width: 1080,
      height: 1920
    }).then((canvas) => {
      // Convert canvas to an image
      const dataUrl = canvas.toDataURL('image/png');

      // Trigger download of the image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'popup-image.png';
      link.click();
    }).catch((error) => {
      console.error('Error capturing the popup with html2canvas:', error);
    }); */
  }

  async captureAndShareImage(element: HTMLElement): Promise<void> {
    try {
      // Capture the element as a canvas
      const canvas = await html2canvas(element);
  
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
