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

  constructor(private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router, private deviceService: DeviceDetectorService) {}

  
  ngOnInit():void {
    console.log(this.deviceService.isMobile());
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.windows = data;
        this.randomPositions = this.windows.map(() => ({
          top: `${Math.floor(Math.random() * 80)}vh`,
          left: `${Math.floor(Math.random() * 80)}vw`
        }));
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
   // this.windows.forEach(() => {
   //   const top = `${Math.floor(Math.random() * 80)}vh`;
   //   const left = `${Math.floor(Math.random() * 80)}vw`;
   //   this.randomPositions.push({ top, left });
   // });
  }
}