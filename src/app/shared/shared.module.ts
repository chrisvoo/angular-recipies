import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { DropdownDirective } from './dropdown.directive';


@NgModule({
  declarations: [
    LoadingComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule { }
