import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  private static zIndexCounter = 1000; // Shared z-index counter
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;
  private touchMoveListener: (() => void) | null = null;
  private touchEndListener: (() => void) | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Ensure the element is positioned for dragging
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'move');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.startDragging(event.clientX, event.clientY);
    
    // Add mouse event listeners
    this.mouseMoveListener = this.renderer.listen('window', 'mousemove', (moveEvent: MouseEvent) => this.onMouseMove(moveEvent));
    this.mouseUpListener = this.renderer.listen('window', 'mouseup', () => this.onMouseUp());
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.startDragging(touch.clientX, touch.clientY);

    // Add touch event listeners
    this.touchMoveListener = this.renderer.listen('window', 'touchmove', (moveEvent: TouchEvent) => this.onTouchMove(moveEvent));
    this.touchEndListener = this.renderer.listen('window', 'touchend', () => this.onTouchEnd());
  }

  private startDragging(clientX: number, clientY: number): void {
    this.dragging = true;
    this.dragOffset.x = clientX - this.el.nativeElement.getBoundingClientRect().left;
    this.dragOffset.y = clientY - this.el.nativeElement.getBoundingClientRect().top;

    // Increment zIndexCounter and apply it to the element
    DraggableDirective.zIndexCounter++;
    this.renderer.setStyle(this.el.nativeElement, 'z-index', DraggableDirective.zIndexCounter);
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.moveElement(event.clientX, event.clientY);
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (this.dragging && event.touches.length > 0) {
      const touch = event.touches[0];
      this.moveElement(touch.clientX, touch.clientY);
    }
  }

  private moveElement(clientX: number, clientY: number): void {
    const left = clientX - this.dragOffset.x;
    const top = clientY - this.dragOffset.y;

    this.renderer.setStyle(this.el.nativeElement, 'left', `${left}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${top}px`);
  }

  private onMouseUp(): void {
    this.stopDragging();
  }

  private onTouchEnd(): void {
    this.stopDragging();
  }

  private stopDragging(): void {
    this.dragging = false;

    // Remove event listeners when dragging ends
    if (this.mouseMoveListener) this.mouseMoveListener();
    if (this.mouseUpListener) this.mouseUpListener();
    if (this.touchMoveListener) this.touchMoveListener();
    if (this.touchEndListener) this.touchEndListener();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    // Temporarily bring the element to the top on hover
    this.renderer.setStyle(this.el.nativeElement, 'z-index', DraggableDirective.zIndexCounter + 1);
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Reset scale after hover and restore original z-index if not dragging
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    if (!this.dragging) {
      this.renderer.setStyle(this.el.nativeElement, 'z-index', DraggableDirective.zIndexCounter);
    }
  }
}
