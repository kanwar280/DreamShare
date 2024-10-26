import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2, NgModule} from '@angular/core';
import * as $ from 'jquery';
import * as AWS from 'aws-sdk';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForOf } from '@angular/common';
import { NgStyle } from '@angular/common';
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
  /*
  @ViewChild('canvas1', { static: false }) canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: false }) canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3', { static: false }) canvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas4', { static: false }) canvas4!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas5', { static: false }) canvas5!: ElementRef<HTMLCanvasElement>;
  */
  
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  windows: any[] = [];

  constructor(private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router, private deviceService: DeviceDetectorService) {}

  
  ngOnInit():void {
    console.log(this.deviceService.isMobile());
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.windows = data;
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
    this.windows.forEach(() => {
      const top = `${Math.floor(Math.random() * 80)}vh`;
      const left = `${Math.floor(Math.random() * 80)}vw`;
      this.randomPositions.push({ top, left });
    });
  }
  /*
  ngAfterViewInit(): void {
    this.initializeCanvas(this.canvas1.nativeElement, this.windows[0].Dream, this.windows[0].Image);
    this.initializeCanvas(this.canvas2.nativeElement, this.windows[1].Dream);
    this.initializeCanvas(this.canvas3.nativeElement, this.windows[2].Dream);
    this.initializeCanvas(this.canvas4.nativeElement, this.windows[3].Dream);
    this.initializeCanvas(this.canvas5.nativeElement, this.windows[4].Dream);
    this.makeDraggable(this.canvasWrapper1.nativeElement);
    this.makeDraggable(this.canvasWrapper2.nativeElement);
    this.makeDraggable(this.canvasWrapper3.nativeElement);
    this.makeDraggable(this.canvasWrapper4.nativeElement);
    this.makeDraggable(this.canvasWrapper5.nativeElement);
  }
  
  // Make an element draggable using native JS and Renderer2
  makeDraggable(element: HTMLElement): void {
    const header = element.querySelector('.articles') as HTMLElement;

    this.renderer.listen(header, 'mousedown', (event: MouseEvent) => {
      this.dragging = true;
      this.dragOffset.x = event.clientX - element.offsetLeft;
      this.dragOffset.y = event.clientY - element.offsetTop;

      const mouseMoveListener = this.renderer.listen('window', 'mousemove', (moveEvent: MouseEvent) => {
        this.dragElement(element, moveEvent);
      });

      const mouseUpListener = this.renderer.listen('window', 'mouseup', () => {
        this.dragging = false;
        mouseMoveListener();
        mouseUpListener();
      });
    });
  }

  dragElement(element: HTMLElement, event: MouseEvent): void {
    if (this.dragging) {
      const left = event.clientX - this.dragOffset.x;
      const top = event.clientY - this.dragOffset.y;
      this.renderer.setStyle(element, 'left', left + 'px');
      this.renderer.setStyle(element, 'top', top + 'px');
    }
  }
  */
}
