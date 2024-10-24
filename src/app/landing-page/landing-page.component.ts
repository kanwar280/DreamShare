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
  gotologin(){
    this.Route.navigate(['login']);
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
  update(){
    console.log("again")
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

  initializeCanvas(canvas: HTMLCanvasElement, text: string, imageUrl?: string): void {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const padding = 20;
      context.font = '30px Roboto Mono';
      
      const textWidth = context.measureText(text).width;
        const textHeight = 20; 
        
        let canvasWidth = (textWidth + padding * 2) * devicePixelRatio;
        let canvasHeight = (textHeight + padding * 2) * devicePixelRatio;

        if (imageUrl) {
            const image = new Image();
            image.src = imageUrl;
            image.onload = () => {
                const imageWidth = image.width *3;
                const imageHeight = image.height *3;
                
                canvasWidth = Math.max(textWidth + padding * 2, imageWidth) * devicePixelRatio ;
                canvasHeight = (textHeight + imageHeight + padding * 3) * devicePixelRatio ;
                
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                context.font = '40px Roboto Mono';

                context.scale(devicePixelRatio, devicePixelRatio);
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                context.drawImage(image, padding, textHeight + padding * 2, imageHeight, imageWidth);

                context.fillText(text, padding, imageHeight + padding);
                if (canvasWidth>850){
                  canvasWidth = 850;
                }
                if (canvasHeight>850){
                  canvasHeight = 850;
                }
                this.renderer.setStyle(canvas, 'width', canvasWidth / devicePixelRatio + 'px');
                this.renderer.setStyle(canvas, 'height', canvasHeight / devicePixelRatio + 'px');
            };
        } else {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            context.font = '20px Roboto Mono';
            context.scale(devicePixelRatio, devicePixelRatio);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText(text, padding, textHeight + padding);
            this.renderer.setStyle(canvas, 'width', canvasWidth / devicePixelRatio + 'px');
            this.renderer.setStyle(canvas, 'height', canvasHeight / devicePixelRatio + 'px');

            
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
