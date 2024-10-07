import { Component, AfterViewInit , ViewChild , ElementRef , Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as $ from 'jquery';
import * as AWS from 'aws-sdk';
import { DataServiceService } from './data-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'DreamShare';
  items: any[] = [];
  onsave(){
    console.log("Save");
  }
  @ViewChild('canvas1', { static: false }) canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: false }) canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper1', { static: false }) canvasWrapper1!: ElementRef<HTMLElement>;
  @ViewChild('canvasWrapper2', { static: false }) canvasWrapper2!: ElementRef<HTMLElement>;
  @ViewChild('resizeHandler1', { static: false }) resizeHandler1!: ElementRef<HTMLElement>;
  @ViewChild('resizeHandler2', { static: false }) resizeHandler2!: ElementRef<HTMLElement>;
  @ViewChild('canvasContainer', {static: false}) canvasContainer!: ElementRef<HTMLElement>;

  private dragging = false;
  private resizing = false;
  private dragOffset = { x: 0, y: 0 };
  private readonly fontsize: number = 50;
  private readonly padding: number = 20;
  constructor(private renderer: Renderer2, private dataservice:DataServiceService) {
    
  }
  private canvasIndex = 0;
  ngOnInit():void {
    this.dataservice.fetchData().subscribe(
      (data) => {
        this.items = data;
        this.addNewCanvas()
        console.log(this.items);
      },
      (error) => {
        console.error('error fetching data', error);
      }
    )
  }
  ngAfterViewInit(): void {
    this.initializeCanvas(this.canvas1.nativeElement, 'This is the first canvas with some text.');
    this.initializeCanvas(this.canvas2.nativeElement, 'Another canvas with a different text length.');
    this.makeDraggable(this.canvasWrapper1.nativeElement);
    this.makeDraggable(this.canvasWrapper2.nativeElement);
  
  }

  initializeCanvas(canvas: HTMLCanvasElement, text: string): void {
    const context = canvas.getContext('2d');
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const padding = 20;
      context.font = 'Arial';
      
      
      const textWidth = context.measureText(text).width;

      const scaledWidth = (textWidth + this.padding) * devicePixelRatio;
      const scaledHeight = 50 * devicePixelRatio; // height based on font size

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const w = textWidth + this.padding;
      const h = this.fontsize + this.padding;
      this.renderer.setStyle(canvas, 'width', w + 'px');
      this.renderer.setStyle(canvas, 'height', h + 'px');
      context.scale(devicePixelRatio, devicePixelRatio);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillText(text, this.padding, 30); // Position the text based on font size
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
  addNewCanvas(){
    const text = this.items[this.canvasIndex];
    console.log(text);
    const canvasWrapper = this.renderer.createElement('div');
    this.renderer.addClass(canvasWrapper, 'canvasContainer');

    const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.renderer.appendChild(canvasWrapper, canvas);
    this.renderer.appendChild(this.canvasContainer.nativeElement, canvasWrapper);
    this.initializeCanvas(canvas, text);
    console.log(text);
    this.canvasIndex++;
  }
  

}