import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2, NgModule} from '@angular/core';
import * as $ from 'jquery';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgForOf, NgStyle } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DraggableDirective } from 'app/draggable.directive';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgStyle, DraggableDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
//implements Afterviewinit in export class,(check typo) if using canvases.
export class LandingPageComponent{
  blobImageAsset!: Blob;
  title = 'DreamShare';
  items: any[] = [];
  randomPositions: { top: string, left: string }[] = [];
  gotopost(){
    this.Route.navigate(['postdreams']);
  }
  gotologin(){
    this.Route.navigate(['login']);
  }
  removeArticle(window: any) {
    this.windows = this.windows.filter(w => w !== window);
  }
  
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  windows: any[] = [];

  constructor(private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router, private deviceService: DeviceDetectorService) {
  }
  async fetchAndShareImage(url: string): Promise<void> {
    try {
      // Fetch the image and convert to Blob
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Failed to fetch image:', response.statusText);
        return;
      }
      this.blobImageAsset = await response.blob();

      // Create File and Share
      const filesArray = [
        new File([this.blobImageAsset], `${this.title}.jpg`, {
          type: 'image/jpg',
          lastModified: new Date().getTime(),
        }),
      ];
      const shareData = {
        title: this.title,
        files: filesArray,
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Shared successfully!');
      } else {
        console.error('Sharing not supported on this device or browser.');
      }
    } catch (error) {
      console.error('Error during fetch or share:', error);
    }
  }
  gotoinsta(){

  }
    
  
  ngOnInit():void {
    
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