import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[highlight]' // as an attribute
})
export class BasicHighlightDirective implements OnInit {

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    const { style } = this.el.nativeElement;
    style.backgroundColor = 'yellow'
    style.color = 'black'
  }

}
