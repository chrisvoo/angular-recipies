import { Injectable } from '@angular/core';

/*
 The @Injectable() decorator specifies that Angular can use this class in the DI system.
The metadata, providedIn: 'root', means that the HeroService is visible throughout the application.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(message: string): void {
    console.log(message);
  }
}
