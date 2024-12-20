/*import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2, NgModule} from '@angular/core';
import * as $ from 'jquery';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgForOf, NgStyle, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DraggableDirective } from 'app/draggable.directive';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupComponent } from 'app/popup/popup.component';


interface WindowPosition {
  top: string;  
  left: string;
  startX: number;
  startY: number;
}
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgStyle, DraggableDirective, NgIf, PopupComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  animations: [
    trigger('flyIn', [
      state('hidden', style({ transform: 'translate({{ startX }}px, {{ startY }}px)', opacity: 0 }), {
        params: { startX: 0, startY: 0 },
      }),
      state('visible', style({ transform: 'translate(0, 0)', opacity: 1 })),
      transition('hidden => visible', animate('1s ease-out')),
    ]),
  ],
})
//implements Afterviewinit in export class,(check typo) if using canvases.
export class LandingPageComponent{
  blobImageAsset!: Blob;
  title = 'DreamShare';
  items: any[] = [];
  randomPositions: { top: string, left: string }[] = [];
  animationStates: string[] = [];
  selectedWindow: any = null;
  openPopup(window: any): void {
    this.selectedWindow = window;
  }
  private startAnimations(): void {
    // Small delay before starting animations
    setTimeout(() => {
      this.animationStates = new Array(this.windows.length).fill('visible');
    }, 100);
  }

  closePopup(): void {
    this.selectedWindow = null;
  }

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
    
  
  ngOnInit():void {
    
    console.log(this.deviceService.isMobile());
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.windows = data;
        // Generate random positions and random starting points (off-screen)
        this.randomPositions = this.windows.map(() => {
          const startX = Math.random() > 0.5 ? -500 - Math.random() * 500 : 500 + Math.random() * 500; // Off-screen X
          const startY = Math.random() > 0.5 ? -500 - Math.random() * 500 : 500 + Math.random() * 500; // Off-screen Y

          return {
            top: `${Math.floor(Math.random() * 70)}vh`,
            left: `${Math.floor(Math.random() * 70)}vw`,
            startX,
            startY,
          };
        });
        this.startAnimations();

        // Set all animation states to 'hidden' initially
        this.animationStates = this.windows.map(() => 'hidden');

        // Start animations after a slight delay
        setTimeout(() => {
          this.animationStates = this.windows.map(() => 'visible');
        }, 100);
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
  }
}*/

import { AfterViewInit, Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataServiceService } from '../data-service.service';
import { Router, RouterOutlet } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { DraggableDirective } from 'app/draggable.directive';
import { PopupComponent } from 'app/popup/popup.component';

interface WindowPosition {
  top: string;
  left: string;
}

interface AnimationPosition extends WindowPosition {
  startX: number;
  startY: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgStyle, DraggableDirective, NgIf, PopupComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  animations: [
    trigger('flyIn', [
      state('hidden', style({
        transform: 'translate({{startX}}px, {{startY}}px)',
        opacity: 0
      }), { params: { startX: 0, startY: 0 }}),
      state('visible', style({
        transform: 'translate(0, 0)',
        opacity: 1
      })),
      transition('hidden => visible', animate('1s ease-out'))
    ])
  ]
})
export class LandingPageComponent {
  title = 'DreamShare';
  windows: any[] = [];
  randomPositions: AnimationPosition[] = [];
  animationStates: string[] = [];
  selectedWindow: any = null;

  constructor(
    private renderer: Renderer2,
    private dataservice: DataServiceService,
    private Route: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.dataservice.fetchData().subscribe({
      next: (data) => {
        this.windows = data;
        this.initializePositions();
        this.startAnimations();
      },
      error: (error) => {
        console.error('error fetching data', error);
      }
    });
  }

  private initializePositions(): void {
    this.randomPositions = this.windows.map(() => {
      // Generate random starting positions off-screen
      const startX = Math.random() > 0.5 ? -500 - Math.random() * 500 : 500 + Math.random() * 500;
      const startY = Math.random() > 0.5 ? -500 - Math.random() * 500 : 500 + Math.random() * 500;
      
      // Generate random final positions within viewport
      const position: AnimationPosition = {
        top: `${Math.floor(Math.random() * 70)}vh`,
        left: `${Math.floor(Math.random() * 70)}vw`,
        startX,
        startY
      };
      
      return position;
    });
    
    // Initialize all animation states to 'hidden'
    this.animationStates = new Array(this.windows.length).fill('hidden');
  }

  private startAnimations(): void {
    // Small delay before starting animations
    setTimeout(() => {
      this.animationStates = new Array(this.windows.length).fill('visible');
    }, 100);
  }

  openPopup(window: any): void {
    this.selectedWindow = window;
  }

  closePopup(): void {
    this.selectedWindow = null;
  }

  gotopost(): void {
    this.Route.navigate(['postdreams']);
  }

  gotologin(): void {
    this.Route.navigate(['login']);
  }

  removeArticle(window: any): void {
    this.windows = this.windows.filter(w => w !== window);
    // Also remove the corresponding position and animation state
    const index = this.windows.indexOf(window);
    if (index > -1) {
      this.randomPositions = this.randomPositions.filter((_, i) => i !== index);
      this.animationStates = this.animationStates.filter((_, i) => i !== index);
    }
  }
}