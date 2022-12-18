import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.show') show: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // If you want that a dropdown can also be closed by a click anywhere outside 
  // @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
  //   this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  // }

  @HostListener('click')
  toggleDropdown() {
    this.show = !this.show
    const ul = this.el.nativeElement.parentNode.getElementsByTagName('ul')[0];
    if (ul) {
      if (this.show) {
        this.renderer.addClass(ul, 'show');
        this.renderer.setAttribute(ul, 'data-bs-popper', 'none');
      } else {
        this.renderer.removeClass(ul, 'show');
        this.renderer.removeAttribute(ul, 'data-bs-popper')
      }
    }
  }

}
