import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

/**
 * Usage example: <label for="amount" class="" onEnterColor="yellow" highlight2>amount</label>
 */
@Directive({
  selector: '[highlight2]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = "transparent";
  @Input() onEnterColor: string = "green"
  @Input() onLeaveColor: string = this.defaultColor

  @HostBinding('style.backgroundColor') backgroundColor: string = this.defaultColor; // initial color

  constructor(/* private elRef: ElementRef, private renderer: Renderer2 */) { }

  ngOnInit(): void {

  }

  // takes the event as argument
  @HostListener('mouseenter') mouseOver(eventData: Event) {
    // this.renderer.setStyle(this.elRef.nativeElement, "background-color", "yellow")
    this.backgroundColor = this.onEnterColor;
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    // this.renderer.setStyle(this.elRef.nativeElement, "background-color", "transparent")
    this.backgroundColor = this.onLeaveColor;
  }

}
