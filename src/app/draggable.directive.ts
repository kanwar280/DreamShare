import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  private static ZindexCounter = 1000;
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Ensure the element is positioned absolutely or relatively for dragging
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'move');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {

    DraggableDirective.ZindexCounter++;
    this.renderer.setStyle(this.el.nativeElement, 'z-index', DraggableDirective.ZindexCounter)
    console.log(DraggableDirective.ZindexCounter)
    this.dragging = true;
    this.dragOffset.x = event.clientX - this.el.nativeElement.getBoundingClientRect().left;
    this.dragOffset.y = event.clientY - this.el.nativeElement.getBoundingClientRect().top;

    // Add event listeners for 'mousemove' and 'mouseup'
    this.mouseMoveListener = this.renderer.listen('window', 'mousemove', (moveEvent: MouseEvent) => this.onMouseMove(moveEvent));
    this.mouseUpListener = this.renderer.listen('window', 'mouseup', () => this.onMouseUp());
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const left = event.clientX - this.dragOffset.x;
      const top = event.clientY - this.dragOffset.y;

      this.renderer.setStyle(this.el.nativeElement, 'left', `${left}px`);
      this.renderer.setStyle(this.el.nativeElement, 'top', `${top}px`);
    }
  }

  private onMouseUp(): void {
    this.dragging = false;

    // Remove the event listeners when dragging ends
    if (this.mouseMoveListener) this.mouseMoveListener();
    if (this.mouseUpListener) this.mouseUpListener();
  }
}
