import { Directive, ElementRef, Renderer2, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true,
})
export class DraggableDirective {
  private static zIndexCounter = 1000; // Shared z-index counter
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  private initialTouchX = 0;
  private initialTouchY = 0;

  private initialTouchTime = 0;

  @Output() dismiss = new EventEmitter<void>(); // Emit when item is swiped off screen

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Set initial styles for dragging
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'move');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.startDragging(event.clientX, event.clientY);

    const mouseMoveListener = this.renderer.listen('window', 'mousemove', (moveEvent: MouseEvent) => {
      this.onMove(moveEvent.clientX, moveEvent.clientY);
    });

    const mouseUpListener = this.renderer.listen('window', 'mouseup', () => {
      this.stopDragging();
      mouseMoveListener();
      mouseUpListener();
    });
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.initialTouchX = touch.clientX;
    this.initialTouchY = touch.clientY;
    this.initialTouchTime = event.timeStamp;
    this.startDragging(touch.clientX, touch.clientY);

    const touchMoveListener = this.renderer.listen('window', 'touchmove', (moveEvent: TouchEvent) => {
      const touchMove = moveEvent.touches[0];
      this.onMove(touchMove.clientX, touchMove.clientY);
    });

    const touchEndListener = this.renderer.listen('window', 'touchend', (endEvent: TouchEvent) => {
      this.onTouchEnd(endEvent);
      this.stopDragging();
      touchMoveListener();
      touchEndListener();
    });
  }

  private startDragging(clientX: number, clientY: number): void {
    this.dragging = true;
    this.dragOffset.x = clientX - this.el.nativeElement.getBoundingClientRect().left;
    this.dragOffset.y = clientY - this.el.nativeElement.getBoundingClientRect().top;

    DraggableDirective.zIndexCounter++;
    this.renderer.setStyle(this.el.nativeElement, 'z-index', DraggableDirective.zIndexCounter);
  }

  private onMove(clientX: number, clientY: number): void {
    if (!this.dragging) return;

    const left = clientX - this.dragOffset.x;
    const top = clientY - this.dragOffset.y;

    this.renderer.setStyle(this.el.nativeElement, 'left', `${left}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${top}px`);
  }

  private stopDragging(): void {
    this.dragging = false;
  }

  private onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.initialTouchX;
    const deltaTime = event.timeStamp - this.initialTouchTime;
    const velocityX = deltaX / deltaTime;

    // Trigger swipe out only if deltaX is sufficiently large and velocity indicates a rightward swipe
    if (deltaX > 100 && velocityX > 0.3) {
      this.swipeOutRight();
    }
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

  private swipeOutRight(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.5s ease-out');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(100vw)');

    setTimeout(() => {
      this.dismiss.emit();
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none'); // Hide the element
    }, 500); // 500ms matches the transition duration
  }
}
