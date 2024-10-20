import { AfterViewInit, Component , ViewChild , ElementRef , Renderer2} from '@angular/core';
import * as $ from 'jquery';
import * as AWS from 'aws-sdk';
import { DataServiceService } from '../data-service.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})

export class LandingPageComponent implements AfterViewInit{
  title = 'DreamShare';
  items: any[] = [];
  gotopost(){
    this.Route.navigate(['postdreams']);
  }
  @ViewChild('canvas1', { static: false }) canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: false }) canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3', { static: false }) canvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas4', { static: false }) canvas4!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas5', { static: false }) canvas5!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper1', { static: false }) canvasWrapper1!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrapper2', { static: false }) canvasWrapper2!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrapper3', { static: false }) canvasWrapper3!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrapper4', { static: false }) canvasWrapper4!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrapper5', { static: false }) canvasWrapper5!: ElementRef<HTMLElement>;

  private dragging = false;
  private resizing = false;
  private dragOffset = { x: 0, y: 0 };
  private readonly fontsize: number = 50;
  private readonly padding: number = 20;
  windows: any[] = [];

  constructor(private renderer: Renderer2, private dataservice:DataServiceService, private Route:Router) {}

  private canvasIndex = 0;
  ngOnInit():void {
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.windows = data;
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
  }
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

  initializeCanvas(canvas: HTMLCanvasElement, text: string, imageurl?: string): void {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const padding = 20;
      context.font = 'Roboto Mono';
      
      
      const textWidth = context.measureText(text).width;

      const scaledWidth = (textWidth + this.padding) * devicePixelRatio;
      const scaledHeight = 50 * devicePixelRatio; 
      if (scaledWidth>150){
        const scaledWidth = 250;
      }
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const w = textWidth + this.padding;
      const h = this.fontsize + this.padding;
      this.renderer.setStyle(canvas, 'width', w + 'px');
      this.renderer.setStyle(canvas, 'height', h + 'px');
      context.scale(devicePixelRatio, devicePixelRatio);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillText(text, this.padding, 30);
      var image = new Image()
      image.src = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
      image.onload = function(){
        context.drawImage(image, 10, 34);
      }
    }
  }
  // Make an element draggable using native JS and Renderer2
  makeDraggable(element: HTMLElement): void {
    const header = element.querySelector('.window-header') as HTMLElement;

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
  
}
